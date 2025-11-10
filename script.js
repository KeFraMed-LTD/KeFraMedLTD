// AOS initialized in HTML

// Dynamic WhatsApp messages for product buttons
document.querySelectorAll('.whatsapp-btn').forEach(button => {
  button.addEventListener('click', () => {
    const productName = button.getAttribute('data-product');
    const phone = '254701718080';
    const message = encodeURIComponent(`Hello KeFraMed, I would like to request a quote for ${productName}`);
    const url = `https://wa.me/${phone}?text=${message}`;
    window.open(url, '_blank');
  });
});

// Floating WhatsApp with custom message
document.getElementById('whatsapp-float').addEventListener('click', function(e) {
    e.preventDefault();
    const phone = '254701718080';
    const userMessage = prompt('Enter your message for KeFraMed WhatsApp:', 'Hello, I would like to request a quote');
    if(userMessage) {
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(userMessage)}`;
        window.open(url, '_blank');
    }
});

// Formspree submission success alert
const form = document.getElementById('contactForm');
const alertBox = document.getElementById('formAlert');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const action = form.getAttribute('action');
    const formData = new FormData(form);

    fetch(action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if(response.ok) {
            alertBox.classList.remove('d-none');
            form.reset();
        } else {
            response.json().then(data => {
                alert('Oops! There was a problem submitting your form.');
            })
        }
    }).catch(error => {
        alert('Oops! There was a problem submitting your form.');
    });
});
