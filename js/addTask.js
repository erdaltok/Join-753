


function colorChange1() {
        const button = document.querySelector('#btn1');
        const currentColor = button.style.backgroundColor;
      
        if (currentColor === 'rgb(51, 51, 51)' || currentColor === 'red') {
          button.style.backgroundColor = 'white';
        } else {
          button.style.backgroundColor = 'red';
        }
      }

      function colorChange2() {
        const button = document.querySelector('#btn2');
        const currentColor = button.style.backgroundColor;
      
        if (currentColor === 'rgb(51, 51, 51)' || currentColor === 'yellow') {
          button.style.backgroundColor = 'white';
        } else {
          button.style.backgroundColor = 'yellow';
        }
      }