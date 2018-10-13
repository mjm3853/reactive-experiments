import { fromEvent } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

const refreshButton = document.querySelector('.refresh');
const users = document.querySelector('.users')
const refreshClickStream = fromEvent(refreshButton, 'click');
const requestStream = refreshClickStream.pipe(
    startWith('startup click'),
    map(() => {
        let randomOffset = Math.floor(Math.random() * 500);
        return `https://api.github.com/users?since=${randomOffset}`;
    })
)

requestStream.subscribe(
    (requestUrl) => {
        const responseStream = ajax.getJSON(requestUrl).pipe(
            map((res: any[]) => {
                return res[0];
            })
        );

        responseStream.subscribe(
            (res) => {
                const p = document.createElement("p");
                p.innerHTML = res.login;
                users.appendChild(p);
            },
            (err) => {
                console.log(err);
            }
        );
    },
    (err) => console.log(err),
);
