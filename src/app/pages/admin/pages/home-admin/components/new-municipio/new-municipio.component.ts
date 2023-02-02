import { IndicadoresService } from './../../../../../../services/indicadores.service';
import { Indicador } from './../../../../../../models/indicador';
import { DataDialog } from './../../home-admin.component';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-municipio',
  templateUrl: './new-municipio.component.html',
  styleUrls: ['./new-municipio.component.scss']
})
export class NewMunicipioComponent implements OnInit {

  municipioForm = new FormGroup(({
    municipio: new FormControl('', [Validators.required]),
    dpa_canton: new FormControl(0, [Validators.required]),
    ind_amb: new FormControl(0, [Validators.required]),
    ind_econo: new FormControl(0, [Validators.required]),
    ind_insti: new FormControl(0, [Validators.required]),
    ind_soc: new FormControl(0, [Validators.required]),
  }))

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DataDialog,
    private dialogRef: MatDialogRef<NewMunicipioComponent>,
    private indicadorService: IndicadoresService
  ) {

  }
  ngOnInit(): void {
    if (this.data.municipio) {
      this.fetchMunicipio()
    }
  }
  addMunicipio() {
    if (!this.municipioForm.valid) {
      return
    } else {
      const { municipio, dpa_canton, ind_amb, ind_econo, ind_insti, ind_soc } = this.municipioForm.value;
      var newMunicipio: Indicador = {};
      newMunicipio.municipio = municipio!
      newMunicipio.dpa_canton = dpa_canton!
      newMunicipio.ind_amb = ind_amb!
      newMunicipio.ind_econo = ind_econo!
      newMunicipio.ind_insti = ind_insti!
      newMunicipio.ind_soc = ind_soc!
      newMunicipio.ind_glob_sust = (ind_amb! + ind_econo! + ind_insti! + ind_soc!) / 4
      //add-new
      if (this.data.state == 'Agregar') {
        this.indicadorService.postIndicador(newMunicipio).then(
          (result) => {
            this.dialogRef.close()
          }
        )
      } else {
        this.indicadorService.updateIndicador(newMunicipio, this.data.municipio?.id!).then(
          () => {
            this.dialogRef.close()
          }
        )
      }
    }
  }
  fetchMunicipio() {
    this.municipioForm.setValue({
      municipio: this.data.municipio?.municipio!,
      dpa_canton: this.data.municipio?.dpa_canton!,
      ind_amb: this.data.municipio?.ind_amb!,
      ind_econo: this.data.municipio?.ind_econo!,
      ind_insti: this.data.municipio?.ind_insti!,
      ind_soc: this.data.municipio?.ind_soc!
    })
  }

  get municipio() {
    return this.municipioForm.get('municipio')
  }
  get dpa_canton() {
    return this.municipioForm.get('dpa_canton')
  }
  get ind_amb() {
    return this.municipioForm.get('ind_amb')
  }
  get ind_econo() {
    return this.municipioForm.get('ind_econo')
  }
  get ind_insti() {
    return this.municipioForm.get('ind_insti')
  }
  get ind_soc() {
    return this.municipioForm.get('ind_soc')
  }

}
