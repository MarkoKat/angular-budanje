import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public userArray: Line[] = [];

  public house1: Line[] = [];
  public house2: Line[] = [];
  public house3: Line[] = [];
  public house4: Line[] = [];

  gridHeight: string = '100%';
  solarHeight: string = '50%';
  time: string = 'Waiting...';

  house1Cur: HouseCurrent = new HouseCurrent();
  house2Cur: HouseCurrent = new HouseCurrent();
  house3Cur: HouseCurrent = new HouseCurrent();
  house4Cur: HouseCurrent = new HouseCurrent();

  solarTimeline: string[] = [];

  constructor(private http: HttpClient) {
    this.http
      .get('assets/4houses_7days.csv', { responseType: 'text' })
      .subscribe(
        (data) => {
          let csvToRowArray = data.split('\n');
          for (let index = 1; index < csvToRowArray.length - 1; index++) {
            let row = csvToRowArray[index].split(',');
            const newLine = new Line(
              parseInt(row[0], 10),
              row[1],
              parseFloat(row[31]),
              parseFloat(row[67])
            );
            if (newLine.dataid === 2361) {
              newLine.grid *= -1;
              this.house1.push(newLine);
            } else if (newLine.dataid === 2818) {
              this.house2.push(newLine);
            } else if (newLine.dataid === 3538) {
              this.house3.push(newLine);
            } else if (newLine.dataid === 3456) {
              this.house4.push(newLine);
            }
          }
          console.log(this.house1);
          this.updateGraph(32);
          //this.displayData();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  updateGraph(index: number): void {
    const line = this.house3[index];
    const line1 = this.house1[index];
    const line2 = this.house2[index];
    const line3 = this.house3[index];
    const line4 = this.house4[index];
    //console.log(line);
    if (line1 !== undefined) {
      this.house1Cur.gridHeight = this.getHeight(line1.grid);
      this.house1Cur.toGridHeight = this.getHeight(line1.grid * -1);
      this.house1Cur.solarHeight = this.getHeight(line1.solar);
      this.time = line1.local_15min;

      this.solarTimeline.push(this.getHeight(line1.solar));
      if (this.solarTimeline.length > 20) {
        this.solarTimeline.shift();
      }
    }
    if (line2 !== undefined) {
      this.house2Cur.gridHeight = this.getHeight(line2.grid);
      this.house2Cur.toGridHeight = this.getHeight(line2.grid * -1);
      this.house2Cur.solarHeight = this.getHeight(line2.solar);
    }
    if (line3 !== undefined) {
      this.house3Cur.gridHeight = this.getHeight(line3.grid);
      this.house3Cur.toGridHeight = this.getHeight(line3.grid * -1);
      this.house3Cur.solarHeight = this.getHeight(line3.solar);
    }
    if (line4 !== undefined) {
      this.house4Cur.gridHeight = this.getHeight(line4.grid);
      this.house4Cur.toGridHeight = this.getHeight(line4.grid * -1);
      this.house4Cur.solarHeight = this.getHeight(line4.solar);
    }
    if (index < this.house3.length) {
      setTimeout(() => {
        this.updateGraph(index + 1);
      }, 1000);
    } else {
      setTimeout(() => {
        this.updateGraph(0);
      }, 1000);
    }
  }

  displayData() {
    this.userArray.forEach((line: Line) => {
      setTimeout(() => {
        console.log(line);
      }, 1000);
    });
  }

  getHeight(value: number, ratio: number = 4): string {
    let height: number = value >= 0 ? (value / ratio) * 100 : 0;
    if (height > 100) {
      height = 100;
    }
    return height + '%';
  }
}

export class Line {
  dataid: number;
  local_15min: string;
  grid: number;
  solar: number;

  constructor(
    dataid: number,
    local_15min: string,
    grid: number,
    solar: number
  ) {
    this.dataid = dataid;
    this.local_15min = local_15min;
    this.grid = grid;
    this.solar = solar;
  }
}

export class HouseCurrent {
  gridHeight: string = '0%';
  toGridHeight: string = '0%';
  solarHeight: string = '0%';
}
