document.addEventListener('DOMContentLoaded', () => {
    const squares = document.querySelectorAll('.grid div');
    const playerDisplayed = document.querySelector('#player');

    let currentPlayer = 'PlayerX';

    squares.forEach(square => {
        square.addEventListener('click', clicked);
    });

    function clicked(event) {
        const squaresArray = Array.from(squares);
        const squareIndex = squaresArray.indexOf(event.target);
        console.log(squareIndex);
        if (currentPlayer === 'PlayerX') {
            squaresArray[squareIndex].classList.add('cross');
            currentPlayer = 'PlayerO';
        } else {
            squaresArray[squareIndex].classList.add('circle');
            currentPlayer = 'PlayerX';
        }
        playerDisplayed.innerHTML = currentPlayer;
    }
});

