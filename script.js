let currentFilter = "All";

let contacts =
JSON.parse(localStorage.getItem("contacts")) || [];

function addContact() {

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const category = document.getElementById("category").value;

    let duplicate = contacts.find(
    contact =>
    contact.phone === phone
    );

   if(duplicate){

   alert(
   "Contact already exists!"
);

    return;

} 

   if(phone.length !== 10){

   alert(
   "Enter a valid 10 digit phone number."
);

    return;

}

  if(!email.includes("@")){

  alert(
  "Enter a valid email address."
);

  return;

}

    if(name === "" || phone === "" || email === "") {
        alert("Please fill all fields!");
        return;
    }

    const contact = {
    id: Date.now(),
    name,
    phone,
    email,
    category,
    favorite: false,
    blocked: false,
    createdAt: new Date().toLocaleString(),
    callCount: 0,
    lastCalled: "Never"
};

    contacts.push(contact);

    localStorage.setItem(
    "contacts",
    JSON.stringify(contacts)
);

displayContacts();
    
showToast(
`✅ ${name} added successfully!`
);

    document.getElementById("name").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("email").value = "";
}

function displayContacts() {

    const contactList = document.getElementById("contactList");

    contactList.innerHTML = "";


    let searchText =
    document.getElementById("search")
    .value
    .toLowerCase();

    let filteredContacts =
    contacts.filter(contact =>

    contact.name
    .toLowerCase()
    .includes(searchText)

||

contact.phone
.includes(searchText)

);

if(currentFilter === "Favorites"){

    filteredContacts =
    filteredContacts.filter(
        contact => contact.favorite
    );

}

else if(currentFilter === "Blocked"){

    filteredContacts =
    filteredContacts.filter(
        contact => contact.blocked
    );

}

else if(currentFilter !== "All"){

    filteredContacts =
    filteredContacts.filter(
        contact =>
        contact.category === currentFilter
    );

}

 if(filteredContacts.length === 0){

if(contacts.length === 0){

contactList.innerHTML = `

<div class="not-found">

📇 No Contacts Yet

<br><br>

Add your first contact to get started.

</div>

`;

}

else{

contactList.innerHTML = `

<div class="not-found">

❌ Contact Not Found

<br><br>

Try searching with another name or phone number.

</div>

`;

}

updateCount(filteredContacts.length);

return;

}

filteredContacts.forEach(contact => {

        contactList.innerHTML += `


        <div class="contact-card ${contact.favorite ? 'favorite-card' : ''}">
            <h3>${contact.name}</h3>

             <p>📞 ${contact.phone}</p>

          <p>📧 ${contact.email}</p>

            <p class="badge">${contact.category}</p>

${contact.blocked ?

'<p class="blocked">🚫 Blocked Contact</p>'

:

''}

            <div class="action-buttons">


            <button onclick="callContact('${contact.phone}')"
class="call-btn">
📞 Call
</button>

<button onclick="toggleFavorite(${contact.id})">
${contact.favorite ? '⭐ Favorite' : '☆ Favorite'}
</button>

<button onclick="shareContact(${contact.id})">
↗ Share
</button>

<button class="menu-btn"
onclick="toggleMenu(${contact.id})">
⋮
</button>

<div
id="menu-${contact.id}"
class="popup-menu">

<button onclick="editContact(${contact.id})">
 Edit Contact
</button>

<button onclick="copyNumber('${contact.phone}')">
 Copy Number
</button>

<button onclick="toggleBlock(${contact.id})">
Block / Unblock
</button>

<button onclick="deleteContact(${contact.id})">
 Delete Contact
</button>

<button onclick="showContactInfo(${contact.id})">
ℹ️ Contact Info
</button>

</div>

</div>
        </div>

        `;
    });

   updateCount(filteredContacts.length);
}

function updateCount(count) {

    document.getElementById("contactCount").innerText =

    count === 1

    ?

    "Showing 1 Contact"

    :

    "Showing " + count + " Contacts";

}
function deleteContact(id) {

    let confirmDelete = confirm(
        "⚠️ This contact will be permanently deleted.\n\nDo you want to continue?"
    );

    if(confirmDelete){

        contacts = contacts.filter(
            contact => contact.id !== id
        );

        localStorage.setItem(
        "contacts",
        JSON.stringify(contacts)
);

        displayContacts();

        showToast(
"Contact Deleted"
);
    }

} 

displayContacts();

function searchContacts(){

displayContacts();

}

function editContact(id){

    let contact =
    contacts.find(
        contact => contact.id === id
    );

    let newName =
    prompt(
        "Enter new name:",
        contact.name
    );

    let newPhone =
    prompt(
        "Enter new phone number:",
        contact.phone
    );

    let newEmail =
    prompt(
        "Enter new email:",
        contact.email
    );

    if(
        newName &&
        newPhone &&
        newEmail
    ){

        contact.name = newName;

        contact.phone = newPhone;

        contact.email = newEmail;

        localStorage.setItem(
            "contacts",
            JSON.stringify(contacts)
        );

        displayContacts();

    }

}

function toggleBlock(id){

    let contact = contacts.find(
        contact => contact.id === id
    );

    let confirmAction = confirm(

        contact.blocked

        ?

        "Are you sure you want to unblock this contact?"

        :

        "Are you sure you want to block this contact?"

    );

    if(confirmAction){

        contacts = contacts.map(contact => {

            if(contact.id === id){

                contact.blocked =
                !contact.blocked;

            }

            return contact;

        });

        localStorage.setItem(
            "contacts",
            JSON.stringify(contacts)
        );

        displayContacts();

        let updatedContact =
contacts.find(
contact => contact.id === id
);

showToast(

updatedContact.blocked

?

"🚫 Contact Blocked"

:

"✅ Contact Unblocked"

);
    }

}

function toggleFavorite(id){

    contacts = contacts.map(contact => {

        if(contact.id === id){

            contact.favorite =
            !contact.favorite;

        }

        return contact;

    });

    localStorage.setItem(
        "contacts",
        JSON.stringify(contacts)
    );

    displayContacts();

    showToast(
"⭐ Favorite Updated"
);

}

function filterContacts(type, btn){

    document
    .querySelectorAll(".filters button")
    .forEach(button =>
        button.classList.remove("filter-active")
    );

    btn.classList.add("filter-active");

    currentFilter = type;

    displayContacts();

}

function copyNumber(phone){

navigator.clipboard.writeText(phone)
.then(() => {

showToast(
"📋 Number Copied"
);

});

}

function showMoreOptions(id){

    let choice = prompt(

`Choose an option:

1 - Edit Contact

2 - Copy Number

3 - Block / Unblock

4 - Delete Contact

5 - Contact Info`

);
    if(choice === "1"){

    editContact(id);

}

else if(choice === "2"){

    let contact =
    contacts.find(
        contact => contact.id === id
    );


    copyNumber(contact.phone);

}

else if(choice === "3"){

    toggleBlock(id);

}

else if(choice === "4"){

    deleteContact(id);

}

else if(choice === "5"){

let contact =
contacts.find(
contact => contact.id === id
);

alert(

`Name: ${contact.name}

Phone: ${contact.phone}

Email: ${contact.email}

Category: ${contact.category}

Added On: ${contact.createdAt || "Not Available"}`

);

}

}

function callContact(phone){

    let confirmCall = confirm(
        "Do you want to call " + phone + " ?"
    );

    if(confirmCall){

        let contact =
        contacts.find(
            contact => contact.phone === phone
        );

        if(contact){

            contact.callCount++;

            contact.lastCalled =
            new Date().toLocaleString();

            localStorage.setItem(
                "contacts",
                JSON.stringify(contacts)
            );

        }

        window.location.href =
        "tel:" + phone;

    }

}

function sortContacts(order){

    if(order === "az"){

        contacts.sort((a,b)=>

            a.name.localeCompare(b.name)

        );

    }

    else if(order === "za"){

        contacts.sort((a,b)=>

            b.name.localeCompare(a.name)

        );

    }

    localStorage.setItem(
        "contacts",
        JSON.stringify(contacts)
    );

    displayContacts();

}

function toggleTheme(){

document.body.classList.toggle(
"dark-mode"
);

let btn =
document.getElementById(
"themeBtn"
);

if(
document.body.classList.contains(
"dark-mode"
)
){

btn.innerHTML = "☀️";

localStorage.setItem(
"theme",
"dark"
);

}

else{

btn.innerHTML = "🌙";

localStorage.setItem(
"theme",
"light"
);

}

}

function showToast(message){

let toast =

document.getElementById(
"toast"
);

toast.innerText = message;

toast.classList.add(
"show"
);

setTimeout(()=>{

toast.classList.remove(
"show"
);

},2000);

}

function toggleMenu(id){

    document
    .querySelectorAll(".popup-menu")
    .forEach(menu => {

        if(menu.id !== `menu-${id}`){

            menu.style.display = "none";

        }

    });

    let menu =
    document.getElementById(
        `menu-${id}`
    );

    if(menu.style.display === "block"){

        menu.style.display = "none";

    }

    else{

        menu.style.display = "block";

    }

}

function showContactInfo(id){

let contact = contacts.find(
contact => contact.id === id
);

alert(

`👤 Name: ${contact.name}

📞 Phone: ${contact.phone}

📧 Email: ${contact.email}

🏷️ Category: ${contact.category}

📅 Added On:
${contact.createdAt || "Not Available"}

📞 Call Count:
${contact.callCount || 0}

🕒 Last Called:
${contact.lastCalled || "Never"}`

);

}

document.addEventListener("click", function(event){

    if(
        !event.target.closest(".menu-btn") &&
        !event.target.closest(".popup-menu")
    ){

        document
        .querySelectorAll(".popup-menu")
        .forEach(menu => {

            menu.style.display = "none";

        });

    }

});

window.addEventListener("scroll", function(){

    document
    .querySelectorAll(".popup-menu")
    .forEach(menu => {

        menu.style.display = "none";

    });

});

function shareContact(id){

let contact =
contacts.find(
contact => contact.id === id
);

let contactText =

`Name: ${contact.name}

Phone: ${contact.phone}

Email: ${contact.email}`;

if(navigator.share){

navigator.share({

title: contact.name,

text: contactText

});

}

else{

navigator.clipboard.writeText(
contactText
);

showToast(
"📤 Contact copied for sharing"
);

}

}