import { fromEvent, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, merge, startWith } from 'rxjs/operators';

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
function addParagraph(body: string) {
    const p = document.createElement('p');
    p.innerHTML = body;
    users.appendChild(p);
}

function handleRefresh(body: any[]) {
    if (body) {
        body.forEach((item) => {
            addParagraph(item.login);
        });
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

function clearUsers() {
    while (users.hasChildNodes()) {
        users.removeChild(users.firstChild);
    }
}

requestStream.subscribe(
    (requestUrl) => {
        const responseStream = ajax.getJSON(requestUrl).pipe(
            map((res: any[]) => {
                return res.slice(0, 3);
            }),
            merge(
                of(null),
            ),
        );

        responseStream.subscribe(
            (res: any[]) => {
                handleRefresh(res);
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
