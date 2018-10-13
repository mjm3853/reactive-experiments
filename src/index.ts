import { from, fromEvent, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, merge, mergeMap, startWith, take } from 'rxjs/operators';

const users = document.querySelector('.users');

const refreshButton = document.querySelector('.refresh');
const refreshClickStream = fromEvent(refreshButton, 'click');

const requestStream = refreshClickStream.pipe(
    startWith('startup click'),
    map(() => {
        const randomOffset = Math.floor(Math.random() * 500);
        return `https://api.github.com/users?since=${randomOffset}`;
    }),
);

const responseStream = requestStream.pipe(
    mergeMap((req) => {
        return ajax.getJSON(req).pipe(
            map((res) => res),
            merge(
                of(null),
            ),
        );
    }),
);

const userStream = responseStream.pipe(
    mergeMap((req) => {
        if (req) {
            return from(req).pipe(take(3));
        } else {
            clearUsers();
            return of(null);
        }
    }),
);

userStream.subscribe(
    (user) => {
        handleUser(user);
    },
    (err) => {
        handleError(err);
    },
);

function handleUser(body: any) {
    if (body) {
        if (body.login) {
            addParagraph(body.login);
        } else {
            const val = JSON.stringify(body);
            addParagraph(val);
        }
    } else {
        clearUsers();
    }
}

function handleError(body: string) {
    if (body) {
        addParagraph(body);
        clearUsers();
    } else {
        clearUsers();
    }
}

function addParagraph(body: string) {
    const p = document.createElement('p');
    p.innerHTML = body;
    users.appendChild(p);
}

function clearUsers() {
    while (users.hasChildNodes()) {
        users.removeChild(users.firstChild);
    }
}
