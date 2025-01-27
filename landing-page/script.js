
(function() {
    // https://dashboard.emailjs.com/admin/account
    emailjs.init("07Ec7al67-83bdo0c");
})();


window.onload = function() {
    document.getElementById('contactForm').addEventListener('submit', function(event) {
        event.preventDefault();
        // these IDs from the previous steps
        emailjs.send('CooCoo', 'template_h8j2rne', {
            from_name: document.getElementById('name').value,
            reply_to: document.getElementById('email').value,
            message: document.getElementById('message').value,
        })
            .then(() => {
                alert("Message sent successfully!")
                console.log('SUCCESS!');
            }, (error) => {
                alert("Failed to send message. Please try again later.");
                console.log('FAILED...', error);
            });
    });
}

