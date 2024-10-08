const amountInput = document.getElementById('amount');
const termInput = document.getElementById('term');
const interestInput = document.getElementById('interest');
const form = document.querySelector('form');
const inputs = form.querySelectorAll('input:not([type="radio"])');
const radios = form.querySelectorAll('input[type="radio"]');
const imagenBase = document.querySelector('#imagen');
const imagenModal = document.querySelector('#imagen_modal');
const clear = document.querySelector('.clear');
const validadorNumero = (e) => {
    let value = e.target.value;
    const hasDecimal = value.includes('.');
    value = value.replace(/[^\d.]/g, '');
    if (hasDecimal) {
        const parts = value.split('.');
        value = parts[0] + '.' + parts.slice(1).join('');
    }

    e.target.value = value;
}


const ponerComas = (e) => {
    let value = e.target.value.replace(/,/g, '');
    const [integerPart, decimalPart] = value.split('.');
    if (!isNaN(integerPart)) {
        e.target.value = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (decimalPart ? '.' + decimalPart : '');
    }
}

const verificar = (e) => {
    let tieneError = false;
    inputs.forEach(input => {
        const aviso = input.closest('div').nextElementSibling;
        const logoSpan = input.parentElement.querySelector('.input-group-text');

        if (!input.value.trim()) {
            input.style.border = '1px solid hsl(4, 69%, 50%)';
            if (logoSpan) {
                logoSpan.classList.add('logo-red');
            }
            if (aviso && aviso.classList.contains('aviso')) {
                aviso.classList.remove('hidden');
                aviso.style.display = 'block';
            }
            tieneError = true;
        }
    })
    const avisoRadio = form.querySelector('.aviso-radio');
    let seleccionoRadio = false;

    radios.forEach(radio => {
        if (radio.checked) {
            seleccionoRadio = true;
        }
    })

    if (!seleccionoRadio) {
        if (avisoRadio && avisoRadio.classList.contains('aviso')) {
            avisoRadio.classList.toggle('hidden');
            avisoRadio.style.display = 'block';
        }
        tieneError = true;
    } else {
        if (avisoRadio && avisoRadio.classList.contains('aviso')) {
            avisoRadio.classList.add('hidden');
            avisoRadio.textContent = '';
        }
    }

    return tieneError;
}
const quitarError = (input) => {
    const aviso = input.closest('div').nextElementSibling;
    const logoSpan = input.parentElement.querySelector('.input-group-text');

    if (input.value.trim()) {
        input.style.border = '';
        if (logoSpan) {
            logoSpan.classList.remove('logo-red');
        }
        if (aviso && aviso.classList.contains('aviso')) {
            aviso.classList.add('hidden');
            aviso.textContent = '';
        }
    }
}
radios.forEach(radio => {
    radio.addEventListener('change', () => {
        const avisoRadio = form.querySelector('.aviso-radio');
        if (avisoRadio && avisoRadio.classList.contains('aviso')) {
            avisoRadio.classList.add('hidden');
            avisoRadio.textContent = '';
        }
    })
})
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const hasErrors = verificar();
    
    if (hasErrors) {
        console.log("Formulario incompleto");
    } else {
        toggleImages();
        console.log("Formulario completo");
        const amount = parseFloat(document.getElementById('amount').value.replace(/,/g, '')) || 0;
        const term = parseInt(document.getElementById('term').value) || 0;
        const interest = parseFloat(document.getElementById('interest').value) || 0;
        const interestMonthly = (interest / 12) / 100;
        const totalMonths = term * 12;

        const selectedRadio = form.querySelector('input[name="radio"]:checked').value;
        const monthly = (amount * interestMonthly * Math.pow(1 + interestMonthly, totalMonths))/(Math.pow(1 + interestMonthly, totalMonths)-1);
        if(selectedRadio==='1'){
            const total = (monthly* totalMonths);
            document.querySelector('.monthly').textContent = `$${ponerComasResultado(monthly.toFixed(2))}`;
            document.querySelector('.total').textContent = `$${ponerComasResultado(total.toFixed(2))}`;
            document.querySelector('.monthly-label').textContent = 'Your monthly repayments';
            document.querySelector('.total-label').textContent = 'Total you\'ll repay over the term';
        } else if (selectedRadio === '2'){
            const monthlyInterest = monthly-(amount/totalMonths)
            const totalInterest = monthlyInterest * totalMonths; 
            document.querySelector('.monthly').textContent = `$${ponerComasResultado(monthlyInterest.toFixed(2))}`;
            document.querySelector('.total').textContent = `$${ponerComasResultado(totalInterest.toFixed(2))}`;
            document.querySelector('.monthly-label').textContent = 'Monthly interest payment';
            document.querySelector('.total-label').textContent = 'Total interest paid';
        }
        document.getElementById('imagen').classList.add('d-none');
        document.getElementById('imagen_modal').classList.remove('d-none');

        
    }
})
clear.addEventListener('click', toggleImages);
amountInput.addEventListener('input', (e) => {
    validadorNumero(e);
    ponerComas(e);
    quitarError(e.target);
})
termInput.addEventListener('input', (e) => {
    validadorNumero(e);
    quitarError(e.target);
})
interestInput.addEventListener('input', (e) => {
    validadorNumero(e);
    quitarError(e.target);
})
function toggleImages() {
    imagenBase.classList.toggle('d-none');
    imagenModal.classList.toggle('d-none');
}
function ponerComasResultado(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}