import { Indicador } from './../models/indicador';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndicadoresService {

  private indicadoresCollection: AngularFirestoreCollection<Indicador>;
  indicadores: Observable<Indicador[]>;

  constructor(
    private afs: AngularFirestore
  ) {
    this.indicadoresCollection = afs.collection<Indicador>('ind_Municipal');
    this.indicadores = this.indicadoresCollection.valueChanges();
  }

  getAllIndicadores() {
    return this.afs.collection<Indicador>('ind_Municipal',ref=>ref.orderBy('dpa_canton')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Indicador
        return data
      }))
    )
  }
}
