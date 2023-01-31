import { Observable, startWith, map } from 'rxjs';
import { FormControl } from '@angular/forms';
import { AuthService } from './../../../../services/auth.service';
import { Indicador, IndicadorID } from './../../../../models/indicador';
import { IndicadoresService } from './../../../../services/indicadores.service';
import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.scss']
})
export class HomeAdminComponent implements OnInit {
  @ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>;
  constructor(private indiService: IndicadoresService,private authService: AuthService, private userService:UserService) {
  }
  allData: Indicador[] = []
  matrizData: any[] = []
  filterData: string[]=[]
  //char-banderas
  loadSus = false
  loadEco=false
  loadSoc=false
  loadAmb=false
  loadInst=false
  //Mejores y Peores
  bestEco={
    municipio:'',
    value:0
  }
  worstEco={
    municipio:'',
    value:10
  }
  bestSoc={
    municipio:'',
    value:0
  }
  worstSoc={
    municipio:'',
    value:10
  }
  bestAmb={
    municipio:'',
    value:0
  }
  worstAmb={
    municipio:'',
    value:10
  }
  bestInst={
    municipio:'',
    value:0
  }
  worstInst={
    municipio:'',
    value:10
  }
  bestGlobal={
    municipio:'',
    value:0
  }
  worstGlobal={
    municipio:'',
    value:10
  }
  //average
  avgEco=0
  avgSoc=0
  avgAmb=0
  avgInst=0
  avgGlob=0
  //user
  userName= 'NO NAME'
  userId=''

  myControl = new FormControl('');
  filteredOptions!: Observable<string[]>;

  ngOnInit(): void {
    this.userId = localStorage.getItem('user')!
    this.fetchUserInfo()
    this.fetchIndcadores()
    //filterDATA
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.filterData.filter(option => option.toLowerCase().includes(filterValue));
  }

  showMunicipio(municipio:string){
    const isMunicipio = (element:string)=>(element)===(municipio)
    const i = this.filterData.findIndex(isMunicipio)
    const isInst =(element:string)=>(element)===('ind_insti')
    const ind1 = this.matrizData[0].findIndex(isInst)
    const isEco =(element:string)=>(element)===('ind_econo')
    const ind2 = this.matrizData[0].findIndex(isEco)
    const isSoc =(element:string)=>(element)===('ind_soc')
    const ind3 = this.matrizData[0].findIndex(isSoc)
    const isAmb =(element:string)=>(element)===('ind_amb')
    const ind4 = this.matrizData[0].findIndex(isAmb)
    const isGlob =(element:string)=>(element)===('ind_glob_sust')
    const ind5 = this.matrizData[0].findIndex(isGlob)



    this.loadSus = false

    let  radarConfig: ChartConfiguration['options'] = {
      responsive: true,
      scales: {
        r:{
          pointLabels:{
            display:true
          }
        }
      }
    };
    this.radarSusChartOptions = radarConfig
    this.radarSusChartOptions?.scales
    this.radarSusChartData.labels = [,this.matrizData[0][ind5],this.matrizData[0][ind1],this.matrizData[0][ind2],this.matrizData[0][ind3],this.matrizData[0][ind4]]
    const row = [this.matrizData[ind5+1][i],this.matrizData[ind1+1][i],this.matrizData[ind2+1][i],this.matrizData[ind3+1][i],this.matrizData[ind4+1][i]]
    console.log(row)
    this.radarSusChartData.datasets[0].data = row
    this.radarSusChartData.datasets[0].label=municipio
    if(this.radarSusChartData.datasets.length==1){
      this.radarSusChartData.datasets.push({data:[],label:''})
    }
    this.radarSusChartData.datasets[1].data = [this.avgGlob,this.avgInst,this.avgEco,this.avgSoc,this.avgAmb]
    this.radarSusChartData.datasets[1].label="Promedio General"
    this.charts.forEach(chart => {
      chart?.update();
    })
    this.loadSus = true
  }

  fetchUserInfo(){
    this.userService.getUserById(this.userId).subscribe(user=>{
      this.userName = user.name!
    })
  }

  fetchIndcadores() {
    this.indiService.getAllIndicadores().subscribe((data) => {
      this.allData = data
      this.matrizData = this.extracData(this.allData)
      this.fetchRadarSustentabilidad()
      this.fetchRadarEconomico()
      this.fetchRadarSocial()
      this.fetchRadarAmbiental()
      this.fetchRadarInstitucional()
    })
  }
  extracData(data: Indicador[]) {
    let result: any[] = []
    let keys: string[] = Object.keys(data[0])
    result.push(keys)
    keys.forEach(key => {
      result.push([])
    })
    data.forEach(dat => {
      let k = Object.keys(dat)
      let v = Object.values(dat)
      for (let i = 0; i < keys.length; i++) {
        let j: number
        const iskey = (element: String) => (element) == (keys[i])
        j = k.findIndex((iskey))
        result[i + 1].push(v[j])
      }
      this.filterData.push(dat.municipio!)
    })
    return result
  }

  fetchRadarSustentabilidad() {

    let radarConfg: ChartConfiguration['options'] = {
      responsive: true,
      scales: {
        r:{
          pointLabels:{
            display:false
          }
        }
      }
    };
    if(this.radarSusChartData.datasets.length>1){
      this.radarSusChartData.datasets.pop
    }
    this.radarSusChartData.datasets[0].label='Indice Global Sustentabilidad'
    this.loadSus = false
    this.radarSusChartOptions = radarConfg

    const isMunicipio = (element: string) => (element) == ('municipio')
    const x = this.matrizData[0].findIndex(isMunicipio)
    const col = this.matrizData[x + 1]
    this.radarSusChartData.labels = col

    const iskey = (element: string) => (element) == ('ind_glob_sust')
    const i = this.matrizData[0].findIndex(iskey)
    const row = this.matrizData[i + 1]
    this.radarSusChartData.datasets[0].data = row

    this.charts.forEach(chart => {
      chart?.update();
    })
    this.loadSus = true
    //best&worst
    var total=0
    for (let n = 0; n < row.length; n++) {
      if(row[n]>this.bestGlobal.value){
        this.bestGlobal.municipio=col[n]
        this.bestGlobal.value=row[n]
      }
      if(row[n]<this.worstGlobal.value){
        this.worstGlobal.municipio=col[n]
        this.worstGlobal.value=row[n]
      }
      //AvgGlob
      total+=row[n]
    }
    this.avgGlob=total/row.length

  }

  fetchRadarEconomico() {
    this.loadEco = false

    const isMunicipio = (element: string) => (element) == ('municipio')
    const x = this.matrizData[0].findIndex(isMunicipio)
    const col = this.matrizData[x + 1]
    this.radarEcoChartData.labels = col


    const iskey = (element: string) => (element) == ('ind_econo')
    const i = this.matrizData[0].findIndex(iskey)
    const row = this.matrizData[i + 1]
    this.radarEcoChartData.datasets[0].data = row

    this.charts.forEach(chart => {
      chart?.update();
    })
    this.loadEco = true
    //best&worst
    var total=0
    for (let n = 0; n < row.length; n++) {
      if(row[n]>this.bestEco.value){
        this.bestEco.municipio=col[n]
        this.bestEco.value=row[n]
      }
      if(row[n]<this.worstEco.value){
        this.worstEco.municipio=col[n]
        this.worstEco.value=row[n]
      }
      total+=row[n]
    }
    this.avgEco=total/row.length
  }

  fetchRadarSocial() {
    this.loadSoc = false
    const isMunicipio = (element: string) => (element) == ('municipio')
    const x = this.matrizData[0].findIndex(isMunicipio)
    const col =this.matrizData[x + 1]
    this.radarSocChartData.labels = col


    const iskey = (element: string) => (element) == ('ind_soc')
    const i = this.matrizData[0].findIndex(iskey)
    const row = this.matrizData[i + 1]
    this.radarSocChartData.datasets[0].data = row

    this.charts.forEach(chart => {
      chart?.update();
    })
    this.loadSoc = true
    var total=0
    //best&worst
    for (let n = 0; n < row.length; n++) {
      if(row[n]>this.bestSoc.value){
        this.bestSoc.municipio=col[n]
        this.bestSoc.value=row[n]
      }
      if(row[n]<this.worstSoc.value){
        this.worstSoc.municipio=col[n]
        this.worstSoc.value=row[n]
      }
      total+=row[n]
    }
    this.avgSoc=total/row.length
  }

  fetchRadarAmbiental() {
    this.loadAmb = false
    const isMunicipio = (element: string) => (element) == ('municipio')
    const x = this.matrizData[0].findIndex(isMunicipio)
    const col = this.matrizData[x + 1]
    this.radarAmbChartData.labels = col

    const iskey = (element: string) => (element) == ('ind_amb')
    const i = this.matrizData[0].findIndex(iskey)
    const row = this.matrizData[i + 1]
    this.radarAmbChartData.datasets[0].data = row

    this.charts.forEach(chart => {
      chart?.update();
    })
    this.loadAmb = true
    var total=0
    //best&worst
    for (let n = 0; n < row.length; n++) {
      if(row[n]>this.bestAmb.value){
        this.bestAmb.municipio=col[n]
        this.bestAmb.value=row[n]
      }
      if(row[n]<this.worstAmb.value){
        this.worstAmb.municipio=col[n]
        this.worstAmb.value=row[n]
      }
      total+=row[n]
    }
    this.avgAmb=total/row.length
  }

  fetchRadarInstitucional() {
    this.loadInst = false
    const isMunicipio = (element: string) => (element) == ('municipio')
    const x = this.matrizData[0].findIndex(isMunicipio)
    const col = this.matrizData[x + 1]
    this.radarInstChartData.labels = col

    const iskey = (element: string) => (element) == ('ind_insti')
    const i = this.matrizData[0].findIndex(iskey)
    const row =this.matrizData[i + 1]
    this.radarInstChartData.datasets[0].data = row

    this.charts.forEach(chart => {
      chart?.update();
    })
    this.loadInst = true
    var total =0
    //best&worst
    for (let n = 0; n < row.length; n++) {
      if(row[n]>this.bestInst.value){
        this.bestInst.municipio=col[n]
        this.bestInst.value=row[n]
      }
      if(row[n]<this.worstInst.value){
        this.worstInst.municipio=col[n]
        this.worstInst.value=row[n]
      }
      total+=row[n]
    }
    this.avgInst=total/row.length
  }
  // RadarSustentabilidad
  public radarSusChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      r:{
        pointLabels:{
          display:false
        }
      }
    }
  };

  public radarSusChartData: ChartData<'radar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Indice de sustentabilidad' },
    ]
  };
  public radarSusChartType: ChartType = 'radar';

  // RadarEco
  public radarEcoChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      r:{
        pointLabels:{
          display:false
        }
      }
    }
  };

  public radarEcoChartData: ChartData<'radar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Indice de Economico' },
    ]
  };
  public radarEcoChartType: ChartType = 'radar';
// RadarSoc
  public radarSocChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      r:{
        pointLabels:{
          display:false
        }
      }
    }
  };

  public radarSocChartData: ChartData<'radar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Indice Social' },
    ]
  };
  public radarSocChartType: ChartType = 'radar';
  // RadarAmb
  public radarAmbChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      r:{
        pointLabels:{
          display:false
        }
      }
    }
  };

  public radarAmbChartData: ChartData<'radar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Indice Ambiental' },
    ]
  };
  public radarAmbChartType: ChartType = 'radar';
  // RadarInst
  public radarInstChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      r:{
        pointLabels:{
          display:false
        }
      }
    }
  };

  public radarInstChartData: ChartData<'radar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Indice Institucional' },
    ]
  };
  public radarInstChartType: ChartType = 'radar';

  logOut(){
    this.authService.logout().subscribe(()=>{
      window.location.reload();
    })
  }
}

