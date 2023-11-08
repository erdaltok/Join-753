


function colorChange1() {
        const button = document.querySelector('#btn1');
        const currentColor = button.style.backgroundColor;
      
        if (currentColor === 'rgb(51, 51, 51)' || currentColor === 'rgb(223, 103, 103)') {
          button.style.backgroundColor = 'white';
        } else {
          button.style.backgroundColor = 'rgb(223, 103, 103)';
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

      function colorChange3() {
        const button = document.querySelector('#btn3');
        const currentColor = button.style.backgroundColor;
      
        if (currentColor === 'rgb(51, 51, 51)' || currentColor === 'rgb(8, 134, 8)') {
          button.style.backgroundColor = 'white';
        } else {
          button.style.backgroundColor = 'rgb(8, 134, 8)';
        }
      }

      