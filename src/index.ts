import { fromEvent, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

const refreshButton = document.querySelector('.refresh');
const refreshClickStream = fromEvent(refreshButton, 'click');
const requestStream = refreshClickStream.pipe(
    startWith('startup click'),
    map(
        () => {
            let randomOffset = Math.floor(Math.random() * 500);
            return `https://api.github.com/users?since=${randomOffset}`;
        }
    )
)

requestStream.subscribe(
    (requestUrl) => {
        ajax.getJSON(requestUrl).subscribe(
            (res) => console.log(res),
            (err) => console.log(err),
        );
    },
    (err) => console.log(err),
);
