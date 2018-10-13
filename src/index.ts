import { from, fromEvent, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, merge, startWith, take } from 'rxjs/operators';

const refreshButton = document.querySelector('.refresh');
const users = document.querySelector('.users');
const refreshClickStream = fromEvent(refreshButton, 'click');
const requestStream = refreshClickStream.pipe(
    startWith('startup click'),
    map(() => {
        const randomOffset = Math.floor(Math.random() * 500);
        return `https://api.github.com/users?since=${randomOffset}`;
    }),
);

requestStream.subscribe(
    (requestUrl) => {
        const responseStream = ajax.getJSON(requestUrl).pipe(
            map((res) => res),
            merge(
                of(null),
            ),
        );

        responseStream.subscribe(
            (res: any[]) => {
                if (res) {
                    const usersStream = from(res).pipe(take(3));

                    usersStream.subscribe(
                        (user) => {
                            handleUser(user);
                        },
                        (err) => {
                            handleError(err);
                        },
                    );
                } else {
                    clearUsers();
                }
            },
            (err) => {
                handleError(err);
            },
        );
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
