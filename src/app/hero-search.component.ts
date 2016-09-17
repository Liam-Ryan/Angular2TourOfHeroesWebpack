import {Component, OnInit} from "@angular/core";
import {HeroSearchService} from "./hero-search.service";
import {Hero} from "./hero";
import {Observable, Subject} from "rxjs";
import {Router} from "@angular/router";
@Component({
    selector: 'hero-search',
    templateUrl: './hero-search.component.html',
    styleUrls: ['./hero-search.component.css'],
    providers: [HeroSearchService]
})

export class HeroSearchComponent implements OnInit{
    heroes: Observable<Hero[]>;
    private searchTerms = new Subject<string>()

    constructor(
        private heroSearchService: HeroSearchService,
        private router: Router
    ){}

    search(term: string): void{
        this.searchTerms.next(term);
    }

    ngOnInit() : void{
        this.heroes = this.searchTerms
            .debounceTime(300)
            .distinctUntilChanged()
            .switchMap(term => term ? this.heroSearchService.search(term) : Observable.of<Hero[]>([]))
            .catch(error => {
                console.error(error);
                return Observable.of<Hero[]>([]);
            })
    }

    gotoDetail(hero: Hero): void {
        let link = ['/detail', hero.id];
        this.router.navigate(link);
    }

}