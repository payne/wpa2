import { Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { Auth, authState, signInAnonymously, signOut, User, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { traceUntilFirst } from '@angular/fire/performance';
import { Router } from '@angular/router';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Vote } from './vote';
import { Story } from './story';
import { VoteService } from './vote.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'wpa2';
  votes: Vote[] = [];
  listeningForVotes = false;
  storyName = 'StoryName';
  story: Story;

  private readonly userDisposable: Subscription|undefined;
  public readonly user: Observable<User | null> = EMPTY;

  showLoginButton = false;
  showLogoutButton = false;

  constructor(private voteService: VoteService, 
    @Optional() private auth: Auth) {
    this.story = new Story('');
    if (auth) {
      this.user = authState(this.auth);
      this.userDisposable = authState(this.auth).pipe(
        traceUntilFirst('auth'),
        map(u => !!u)
      ).subscribe(isLoggedIn => {
        this.showLoginButton = !isLoggedIn;
        this.showLogoutButton = isLoggedIn;
      });
    }
  }

  private listenForVotes() {
    if (this.listeningForVotes) return;
    this.voteService.getVotes().subscribe(vs => {
      this.votes = vs;
      console.log(`votes: ${JSON.stringify(this.votes)}`);
    });
    this.listeningForVotes = true;
  }

  ngOnInit(): void { 
    this.loginAnonymously();
    this.voteService.getStoryName().subscribe(s => {
      this.story = s;
      this.storyName = s.value;
    });
  }

  ngOnDestroy(): void {
    if (this.userDisposable) {
      this.userDisposable.unsubscribe();
    }
  }

saveStoryName(newValue: any) {
  console.log(`newValue is:`);
  console.log(newValue);
  this.storyName = newValue;
  this.voteService.setStoryName(newValue);
  this.voteService.getStoryName().subscribe(s => {
      console.log(`s is:`);
      console.log(s);
      this.story = s; // silly
      this.storyName = s.value;
    });
  }

  async login() {
    return await signInWithPopup(this.auth, 
      new GoogleAuthProvider());
  }

  async loginAnonymously() {
    return await signInAnonymously(this.auth);
  }

  async logout() {
    return await signOut(this.auth);
  }

  onClick() {
    console.log(`onClick()`);
    const vote: Vote = { id: '', storyId: 'story-1', points: 1 };
    this.voteService.addVote(vote);
    this.listenForVotes();
  }
}
