document.addEventListener('DOMContentLoaded', () => {
    const dashboardContainer = document.getElementById('dashboard-container');
    
    fetch('/home/noxcodes/Desktop/CooCoo-app/wireframes/mobile wireframe images/Group Buying Feature Wireframes/Dashboard.png')
        .then(response => response.blob())
        .then(blob => {
            const objectURL = URL.createObjectURL(blob);
            dashboardContainer.innerHTML = `<img src="${objectURL}" alt="Dashboard Screenshot">`;
        })
        .catch(error => {
            console.error('Error loading image:', error);
            dashboardContainer.textContent = 'Failed to load image';
        });
});
