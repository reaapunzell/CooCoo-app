
(function() {
    // https://dashboard.emailjs.com/admin/account
    emailjs.init("95xG3TUDvib5E6det");
})();


window.onload = function() {
    document.getElementById('contactForm').addEventListener('submit', function(event) {
        event.preventDefault();
        // these IDs from the previous steps
        emailjs.send("Coocoo Landing Page","template_3sou7dh", {
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

