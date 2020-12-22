/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

module.exports = {
    defaultCompanyName: 'TechNEXA Technologies',
//    adminUrl: "http://localhost:4200",
//    checkinAppUrl: "http://localhost:4300",
    adminUrl: "https://app.viztors.com",
    checkinAppUrl: "https://app.viztors.com/checkin",
    fast2sms: {
        'authorizationKey': 'AdCR9rNIcK4bDJopU6q5yVO8lLGat2ePzE7vg1WnQhmHXZjxYwUZAiO1Y86e9RTChwp7VExurnfsLcDa',
        'hostname': 'www.fast2sms.com',
        'port': null,
        'path': '/dev/bulk',
        'sender_id': 'FSTSMS',
        'language': 'english',
        'route': 't',
    },
    tinyUrl: {
        "url": "https://tinyurl.com/create.php"
    }
};
