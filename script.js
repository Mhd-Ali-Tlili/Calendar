const monthYear = document.getElementById("monthYear");
const calendarBody = document.getElementById("calendarBody");
const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");
const dateDetails = document.getElementById("date-details");
const eventForm = document.getElementById("eventForm");
const eventDateInput = document.getElementById("eventDate");
const eventDescriptionInput = document.getElementById("eventDescription");

let currentDate = new Date();
let events = {}; // Pour stocker les événements sous forme d'objet

// Fonction pour formater la date au format YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function generateCalendar(date) {
    const month = date.getMonth();
    const year = date.getFullYear();

    monthYear.textContent = `${date.toLocaleString('en-US', { month: 'long' })} ${year}`;

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

    // Ajuster le premier jour de la semaine pour le format européen (lundi)
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    calendarBody.innerHTML = "";

    let row = document.createElement("tr");

    // Ajouter des cases vides jusqu'au premier jour du mois
    for (let i = 0; i < adjustedFirstDay; i++) {
        const cell = document.createElement("td");
        row.appendChild(cell);
    }

    for (let day = 1; day <= lastDateOfMonth; day++) {
        if ((adjustedFirstDay + day - 1) % 7 === 0) {
            calendarBody.appendChild(row);
            row = document.createElement("tr");
        }

        const cell = document.createElement("td");
        cell.textContent = day;

        // Vérifier si c'est aujourd'hui
        const today = new Date();
        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            cell.classList.add("today");
        }

        // Vérifier s'il y a un événement pour ce jour
        const formattedDate = formatDate(new Date(year, month, day));
        if (events[formattedDate]) {
            cell.classList.add("event");
        }

        // Ajouter un gestionnaire d'événements pour afficher les détails
        cell.addEventListener("click", () => {
            const selectedDate = new Date(year, month, day);
            const formattedDate = formatDate(selectedDate);
            dateDetails.innerHTML = `<strong>${selectedDate.toLocaleDateString('en-GB')}</strong><br>${events[formattedDate] || 'No events for this date.'}`;
        });

        row.appendChild(cell);
    }

    calendarBody.appendChild(row);
}


// Gestion des boutons de navigation
prevMonthButton.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar(currentDate);
});

nextMonthButton.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar(currentDate);
});

// Gestion du formulaire d'événements
eventForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const eventDate = new Date(eventDateInput.value);
    const eventDescription = eventDescriptionInput.value;

    if (!eventDate || !eventDescription) return;

    // Convertir la date en format YYYY-MM-DD pour la clé
    const formattedDate = formatDate(eventDate);

    // Stocker l'événement dans l'objet
    events[formattedDate] = eventDescription;

    // Réinitialiser le formulaire
    eventForm.reset();

    // Mettre à jour le calendrier pour afficher les nouveaux événements
    generateCalendar(currentDate);
});

// Initialiser le calendrier
generateCalendar(currentDate);
