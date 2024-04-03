// Variable
var dropdownBtn = document.querySelectorAll(`.selectBtn`);
var dropdown = document.querySelectorAll(`.selectBar`);
var dropdownMenu = document.querySelectorAll(`.dropdownMenu`);
var selectInputBar = document.querySelectorAll('.selectInput');
var selectOption = document.querySelectorAll(`.selectBar .selectOption-menu`);

var hiddenData = document.querySelectorAll(`.hiddenData table`);

// all Data in Hidden Menu
var Data = [];
hiddenData.forEach(dd => {
    var row = [];
    dd.querySelectorAll(`tr`).forEach(rowValue => {
        var col = [];
        rowValue.querySelectorAll(`td`).forEach(value => {
            col.push(value.textContent);
        });
        row.push(col);
    });
    Data.push(row);
});
document.querySelector(`.hiddenData`).remove();

console.log(Data);
//mouse clicked
window.addEventListener('mouseup', function(event){
    // console.log(event.target);
    // selected Dropdown
    dropdown.forEach(bar => {
        // Pada setiap dropdown yang ada
        // dropdown akan muncul apabila triggernya ke klik (bar/btn)
        // dropdown akan menghilang jika btn dropdown/elemen selain set dropdown diklik
        if (bar.contains(event.target)) {
            console.log(event.target);
            var ddMenu = bar.querySelector(`.dropdownMenu`);
            var btn = bar.querySelector(`.selectBtn`);
            if (ddMenu.style.display != "none") {
                if (event.target == btn && !ddMenu.contains(event.target)) {
                    ddMenu.style.display = "none";
                    console.log("Menu Ditutup");
                }
                else {
                    // Menu yang dipilih akan mengalami perubahan class (bisa berubah tampilan)
                    // pada dropdown yang saling mentrigger isi dari dropdown akan berubah
                    selectOption.forEach(option => {
                        if (bar.contains(option)) {
                            if (option.classList.contains("selected")) {
                                option.classList.remove("selected");
                            }
                            if (option == event.target) {
                                event.target.classList.add("selected");
                                bar.querySelector(`input`).value = event.target.textContent;
                                let barName = bar.id.substring(0,bar.id.length-3);
                                if (barName == "kota") {
                                    var newData = renderMenu(event.target.textContent,Data[0],Data[1]);
                                    var effectedSuggestion = document.querySelector(`#kecBar .selectOption`);
                                    var newInner = "";
                                    newData.forEach(text => {
                                        newInner += `<ul class="selectOption-menu">` + text + `</ul>`;
                                    });
                                    effectedSuggestion.innerHTML = newInner;
                                    document.querySelector(`#kecBar .selectInput input`).disabled = false;
                                    document.querySelector(`#kecBar .selectInput button`).disabled = false;
                                }
                                // refresh all dropdown menu
                                selectOption = document.querySelectorAll(`.selectBar .selectOption-menu`);
                            }
                        }
                    });
                }
            } else if (ddMenu.style.display == "none"){
                ddMenu.style.display = "block";
                console.log("Menu Dibuka");
            }
        }
        else {
            bar.querySelectorAll(`.dropdownMenu`).forEach(dd => {
                dd.style.display = "none";
                console.log("Semua Menu Ditutup");
            });
        }
    });
});

// render dropdown menu for dynamic sugestion
function renderMenu(triggerValue,TriggerValueMap,allMenu) {
    child = [];
    var triggerId = 1;
    TriggerValueMap.forEach(arr => {
        if (arr[1] == triggerValue) {
            triggerId = arr[0];
        }
    });
    allMenu.forEach(data => {
        if (data[2] == triggerId) {
            child.push(data[1]);
        }
    });
    return child;
}