import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable, retry } from 'rxjs';
import { User, UserId } from 'src/app/models/user';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFirestore
  ) {
    this.userCollection = afs.collection<User>('user');
    this.users = this.userCollection.valueChanges();
   }

   getUserById(id: string){
    return this.afs.doc<User>(`users/${id}`).snapshotChanges().pipe(
      map(a=>{
        console.log(a.payload.data())
        const data = a.payload.data() as UserId
        if(data){
          data.id = a.payload.id
        }
        return data
      })
    )
   }

   getUserByRol(rol: string){
      return this.afs.collection<User>('users', ref => ref.where('rol','==',rol)).snapshotChanges().pipe(
        map(actions=>actions.map(a=>{
          const data = a.payload.doc.data() as UserId
          data.id = a.payload.doc.id
          return data
        }))
      )
   }

   postUser(user: User){
     const userReference = this.afs.doc<User>(`users/${user.mail}`)
     userReference.set(user)
   }
}
