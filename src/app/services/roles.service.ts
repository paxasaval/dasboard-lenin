import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { Rol, RolId } from '../models/rol';


@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private rolCollection: AngularFirestoreCollection<Rol>;
  roles: Observable<Rol[]>;

  constructor(
    private afs: AngularFirestore
  ) {
    this.rolCollection = afs.collection<Rol>('roles');
    this.roles = this.rolCollection.valueChanges();
  }

  getAllRoles() {
    return this.afs.collection<Rol>('roles').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as RolId
        data.id = a.payload.doc.id
        return data
      }))
    )
  }

  getRolByName(name: string) {
    return this.afs.collection<Rol>('roles', ref => ref.where('name', '==', name)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as RolId
        data.id = a.payload.doc.id
        return data
      }))
    )
  }
  getRolById(id: string) {
    return this.afs.doc<Rol>('roles/'+id).snapshotChanges().pipe(
      map(a => {
        const data = a.payload.data() as RolId
        data.id = a.payload.id
        return data
      }))
  }

  updateRol(rol: RolId) {
    const rolReference = this.afs.doc<Rol>(`roles/${rol.id}`)
    rolReference.set(rol)
  }

  deleteRol(rol: RolId) {
    this.afs.doc<Rol>('roles/' + rol.id).delete();
  }
}
