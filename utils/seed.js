const fs = require('fs')
const fetch = require('isomorphic-unfetch')
const BASE_PATH = "/api/users"
const getRootUrl = () => "http://localhost:5000"

const sendRequest = async (path, opts) => {
    if (!opts) opts = {}
    const headers = Object.assign({}, opts.headers || {}, {
        'Content-type': 'application/json; charset=UTF-8',
    });

    const response = await fetch(
        `${getRootUrl()}${path}`, Object.assign({ method: 'POST', credentials: 'same-origin' }, opts, { headers }),
    );

    const data = await response.json()

    return data;
}

const seedUser = (u) =>
    sendRequest(`${BASE_PATH}/admin/seed-user`, {
        body: JSON.stringify({user: u})
    })


function randomDate(date1, date2){
    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }
    var date1 = date1 || '01-01-1970'
    var date2 = date2 || new Date().toLocaleDateString()
    date1 = new Date(date1).getTime()
    date2 = new Date(date2).getTime()
    if( date1>date2){
        return new Date(getRandomArbitrary(date2,date1)).toLocaleDateString()
    } else{
        return new Date(getRandomArbitrary(date1, date2)).toLocaleDateString()

    }
}

const seedDB = () => fs.readFile('./utils/users.txt', 'utf8', (err, data) => {
    data.split('\n').filter(s => !s.match(new RegExp(/.*\t/)) && !(s === "CS -554-WS" || s === "Student" || s === "Teacher")).forEach(async (s, ind) => {
        let [firstName, ...lastName] = s.split(' ')
        lastName = lastName.join(' ').replace('\'', '')
        const u = {
            firstName,
            lastName,
            userName: `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(' ', '.')}`,
            email: `${firstName.toLowerCase()}.${lastName.replace(' ', '.').toLowerCase()}@clientconnect.tech`,
            password: firstName,
            userType: (ind % 2 == 0) ? 'client' : 'freelancer',
            joinDate: randomDate('1/1/2018', '11/25/2018')
        }
        const res = await seedUser(u)
        console.log(res)
    })
})
seedDB()
