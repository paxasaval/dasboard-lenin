import { Observable, startWith, map } from 'rxjs';
import { FormControl } from '@angular/forms';
import { AuthService } from './../../../../services/auth.service';
import { Indicador, IndicadorID } from './../../../../models/indicador';
import { IndicadoresService } from './../../../../services/indicadores.service';
import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { UserService } from 'src/app/services/user.service';
import { RolesService } from 'src/app/services/roles.service';
import { MatDialog } from '@angular/material/dialog';
import { NewMunicipioComponent } from './components/new-municipio/new-municipio.component';

export interface DataDialog{
  state:string,
  municipio?:IndicadorID
}

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.scss']
})
export class HomeAdminComponent implements OnInit {
  @ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>;
  constructor(
    private indiService: IndicadoresService,
    private authService: AuthService,
    private userService:UserService,
    private rolService: RolesService,
    private municipioDialog:MatDialog) {
  }
  //banderaAdmin
  isAdmin=false
  //statesModal
  state='AGREGAR'
  edit=false
  selectedMunicipio!:Indicador
  //DataVars
  allData: IndicadorID[] = []
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
  userRol=''
  myControl = new FormControl('');
  filteredOptions!: Observable<string[]>;

  ngOnInit(): void {
    this.userId = localStorage.getItem('user')!
    this.userRol=localStorage.getItem('rol')!
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
  newMunicipio(){
    this.municipioDialog.open(NewMunicipioComponent,{
      data:{
        state:'Agregar'
      }
    })
  }
  editMunicipio(){
    this.municipioDialog.open(NewMunicipioComponent,{
      data:{
        state:'Editar',
        municipio:this.selectedMunicipio
      }
    })
  }
  showMunicipio(municipio:string){
    const isIndicador = (element:Indicador)=>(element.municipio)===(municipio)
    this.selectedMunicipio=this.allData.find(isIndicador)!
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
    this.radarSusChartData.labels = [this.matrizData[0][ind5],this.matrizData[0][ind1],this.matrizData[0][ind2],this.matrizData[0][ind3],this.matrizData[0][ind4]]
    const row = [this.matrizData[ind5+1][i],this.matrizData[ind1+1][i],this.matrizData[ind2+1][i],this.matrizData[ind3+1][i],this.matrizData[ind4+1][i]]
    console.log(row)
    this.radarSusChartData.datasets[0].data = row
    this.radarSusChartData.datasets[0].label=municipio
    if(this.radarSusChartData.datasets.length==1){
      this.radarSusChartData.datasets.push({data:[],label:''})
    }
    this.radarSusChartData.datasets[1].data = [this.avgGlob,this.avgInst,this.avgEco,this.avgSoc,this.avgAmb]
    this.radarSusChartData.datasets[1].label="Promedio General"
    //ind_Amb
    if(this.radarAmbChartData.datasets.length>1){
      this.radarAmbChartData.datasets[1].data=[this.selectedMunicipio.ind_amb!]
      this.radarAmbChartData.datasets[1].label=this.selectedMunicipio.municipio
    }else{
      this.radarAmbChartData.datasets.push({data:[this.selectedMunicipio.ind_amb!],label:this.selectedMunicipio.municipio!})
    }
    //ind_econo
    if(this.radarEcoChartData.datasets.length>1){
      this.radarEcoChartData.datasets[1].data=[this.selectedMunicipio.ind_econo!]
      this.radarEcoChartData.datasets[1].label=this.selectedMunicipio.municipio
    }else{
      this.radarEcoChartData.datasets.push({data:[this.selectedMunicipio.ind_econo!],label:this.selectedMunicipio.municipio!})
    }
    //ind_insti
    if(this.radarInstChartData.datasets.length>1){
      this.radarInstChartData.datasets[1].data=[this.selectedMunicipio.ind_insti!]
      this.radarInstChartData.datasets[1].label=this.selectedMunicipio.municipio
    }else{
      this.radarInstChartData.datasets.push({data:[this.selectedMunicipio.ind_insti!],label:this.selectedMunicipio.municipio!})
    }
    //ind_soc
    if(this.radarSocChartData.datasets.length>1){
      this.radarSocChartData.datasets[1].data=[this.selectedMunicipio.ind_soc!]
      this.radarSocChartData.datasets[1].label=this.selectedMunicipio.municipio
    }else{
      this.radarSocChartData.datasets.push({data:[this.selectedMunicipio.ind_soc!],label:this.selectedMunicipio.municipio!})
    }
    this.charts.forEach(chart => {
      chart?.update();
    })
    this.loadSus = true
    this.edit=true
  }


  fetchUserInfo(){
    this.userService.getUserById(this.userId).subscribe(user=>{
      this.userName = user.name!
    })
    this.rolService.getRolById(this.userRol).subscribe(rol=>{
      if(rol.name=='admin'){
        this.isAdmin=true
      }
    })

  }

  fetchIndcadores() {
    this.indiService.getAllIndicadores().subscribe((data) => {
      this.allData = data
      this.matrizData = this.extracData(this.allData)
      this.fetchRadarSustentabilidad()
    })
  }
  extracData(data: Indicador[]) {
    this.filterData=[]
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
    //setDataSus
    if(this.radarSusChartData.datasets.length>1){
      this.radarSusChartData.datasets=[{
        data:[],
        label:''
      }]
    }
    //setDataAmb
    if(this.radarAmbChartData.datasets.length>1){
      this.radarAmbChartData.datasets=[this.radarAmbChartData.datasets[0]]
    }
    //setDataEco
    if(this.radarEcoChartData.datasets.length>1){
      this.radarEcoChartData.datasets=[this.radarEcoChartData.datasets[0]]
    }
    //setDataInst
    if(this.radarInstChartData.datasets.length>1){
      this.radarInstChartData.datasets=[this.radarInstChartData.datasets[0]]
    }
    //setDataSoc
    if(this.radarSocChartData.datasets.length>1){
      this.radarSocChartData.datasets=[this.radarSocChartData.datasets[0]]
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
    this.edit=false
    this.fetchRadarEconomico()
      this.fetchRadarSocial()
      this.fetchRadarAmbiental()
      this.fetchRadarInstitucional()

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
      { data: [], label: 'Indice de Economico',borderColor:'rgba(242,183,5)',backgroundColor:'rgba(242,183,5,0.25)',pointBackgroundColor:'rgba(242,183,5)'},
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
      { data: [], label: 'Indice Social',borderColor:'rgba(242,135,5)',backgroundColor:'rgba(242,135,5,0.25)',pointBackgroundColor:'rgba(242,135,5)' },
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
      { data: [], label: 'Indice Ambiental',borderColor:'rgba(242,92,5)',backgroundColor:'rgba(242,92,5,0.25)',pointBackgroundColor:'rgba(242,92,5)' },
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
      { data: [], label: 'Indice Institucional',borderColor:'rgba(69,115,36)',backgroundColor:'rgba(69,115,36,0.25)',pointBackgroundColor:'rgba(69,115,36)' },
    ]
  };
  public radarInstChartType: ChartType = 'radar';

  logOut(){
    this.authService.logout().subscribe(()=>{
      window.location.reload();
    })
  }
}

