export interface Indicador{
  dpa_canton?: number,
  municipio?:string,
  ind_econo?:number,
  ind_soc?:number,
  ind_amb?: number,
  ind_insti?: number,
  ind_glob_sust?:number
}
export interface IndicadorID extends Indicador{id:string}
