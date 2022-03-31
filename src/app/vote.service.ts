import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Firestore, collectionData, collection, addDoc } from '@angular/fire/firestore';

import { Vote } from "./vote";

@Injectable({
    providedIn: "root"
})
export class VoteService {
    constructor(private firestore: Firestore) {}

    getVotes(): Observable<Vote[]> {
        const c = collection(this.firestore, "votes");
        const result$ = collectionData(c);
        return result$.pipe(
            map((votes: any[]) => 
                votes.map(
                    vote => new Vote(vote.id, vote.storyId, vote.points))
            ));
    }

    addVote(vote: Vote) {
       // https://edupala.com/angular-firebase-crud-operation-using-angularfire/
       const votesRef = collection(this.firestore, "votes");
       return addDoc(votesRef, vote);
    }
}