// setTimeout(function () {
//     console.log('Heads');
// }, 1000);

function coinFlip(delay) {
    return new Promise((resolve, reject) => {
        const rand = Boolean(Math.round(Math.random()));
        setTimeout(function() {
            if (rand) {
                resolve('Heads!');
            } else {
                reject('Tails!');
            }
        }, 1000);
    });
}

// coinFlip(500)
//     .then(msg => {
//         console.log(msg);
//     })
//     .catch(err => {
//         console.error(err);
//     });

// coinFlip(500)
// .then(res => {
//     console.log(1, res);
//     return coinFlip(500);
// })
// .then(res => {
//     console.log(2, res);
//     return coinFlip(500);
// })
// .then(res => {
//     console.log(3, res);
//     return 'You Win!';
// })
// .then(res => {
//     console.log(4, res);
// })
// .catch(err => {
//     console.error(err);
// });

const coin1 = coinFlip(100).catch(err => err);
const coin2 = coinFlip(200).catch(err => err);
const coin3 = coinFlip(300).catch(err => err);

Promise.all( [coin1, coin2, coin3] )
    .then(arrayOfResults => {
        console.log(arrayOfResults);
    })
    .catch(err => {
        console.error(err);
    });

    