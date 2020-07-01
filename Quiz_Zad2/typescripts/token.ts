let token: string = null;
fetch("/token")
    .then(response => response.json())
    .then(data => {
        token = data.token;
    })
    .then( () => {
        const inputEl = document.getElementById("tok") as HTMLInputElement;
        inputEl.value = token;
    })