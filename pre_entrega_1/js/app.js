/*Este array de objeto contiene los datos para crear el fondo de inversión
del usuario. Esto será un JSON local más adelante, sería genial si fuera una API*/
const FUNDS = [
    {
        name: 'Ned Flanders - Conservative',
        currency: 'CLP',
        period: 'monthly',
        optimistic: 0.0113,
        realistic: 0.0085,
        pessimistic: 0.0049
    },
    {
        name: 'Lisa Simpson - Moderative',
        currency: 'CLP',
        period: 'monthly',
        optimistic: 0.0129,
        realistic: 0.0092,
        pessimistic: 0.0041
    },
    {
        name: 'Edna Krabappel - Risky',
        currency: 'CLP',
        period: 'monthly',
        optimistic: 0.015,
        realistic: 0.011,
        pessimistic: 0.0044
    },
];

/* Está clase crea el objeto fund con la data del "JSON" según el perfil 
de inversión del usuario. Tiene un método que entrega los retornos esperados
del fondo*/ 
class fund {
    constructor(name, currency, period, optimistic, realistic, pessimistic){
        this.name = name;
        this.currency = currency;
        this.period = period;
        this.optimistic = optimistic;
        this.realistic = realistic; 
        this.pessimistic = pessimistic;
    }
    /*Este método recibe los años de inversión del usuario, el monto inicial y el aporte mensual. Luego aplica
    el cálculo de retorno esperado para los tres escenarios existentes: realistic, optimistic y pessimistic.
    El método devuelve un array con 3 arrays que tienen los retornos mensuales del periodo de inversión para los
    escenarios realistic, optimistic y pessimistic. */
    expectedReturns(years, initialAmount, monthlyAmount){
  	    const MONTHS = years * 12;
        let interests = [this.realistic, this.optimistic, this.pessimistic];
        const EXPECTED_RETURNS = [];
        interests = interests.map((el)=>{
            const TOTAL = [];
            for(let i = 1; i <= MONTHS; i++){
                let sum = 0;
                sum += Math.round(initialAmount* Math.pow((1 + el), i));
                
                for(let j = 0; j<i; j++){
                    sum += Math.round(monthlyAmount * Math.pow((1 + el), j));
         
                }
                TOTAL.push(sum);
                sum = 0;
                
            }

            EXPECTED_RETURNS.push(TOTAL);

        });

 		
        return EXPECTED_RETURNS;
       
    }
};

/*La clase portfolio crea el objeto portfolio que tiene como propiedades el objetivo y la dbPortfolio (que sería como el carrito de compras
en los ecommerces) donde se guardan los objetos simulation que crea el usuario. El método addSimulation llama a las funciones que se encargan
de pedir los datos a los usuarios y validarlos. También crea una nueva una nueva instancia de la clase simulation y la pushea
al dbPortfolio. El método removeSimulation elimina una simulación del dbPortfolio */
class portfolio {
    constructor(goal){
        this.goal = goal;
        this.dbPortfolio = [];
    }

    addSimulation(){
        let userProfile = newUser();

        let userYearsInvest = newYearInvest();

        let initialUserAmount = newInitialUserAmount();

        let monthlyUserAmount = newMonthlyUserAmount();

        //indice para crear el fund del usuario
        let index = userProfile - 1;
          
        this.dbPortfolio.push(new simulation(userYearsInvest,initialUserAmount,monthlyUserAmount,index));
    }
    removeSimulation(item){
        let removedItem = this.dbPortfolio.splice(item,1);
        return removedItem;
    }
}


/* la clase simulation crea el objeto simulation que utiliza los datos que vienen del método addSimulation de la class portfolio
para instanciarse. Dentro de este objeto se crea una instancia de la clase fund y utiliza su método expectedReturns para obtener
los retornos esperados de la inversión del usuario */
class simulation{
    constructor(years, initialAmount, monthlyAmount, indexFund){
        this.fundName = FUNDS[indexFund].name;
        this.years = years;
        this.initialAmount= initialAmount;
        this.monthlyAmount = monthlyAmount;
        let newFund = new fund (FUNDS[indexFund].name, FUNDS[indexFund].currency, FUNDS[indexFund].period, FUNDS[indexFund].optimistic, FUNDS[indexFund].realistic, FUNDS[indexFund].pessimistic );
        this.returns= newFund.expectedReturns(years, initialAmount, monthlyAmount);
        this.totalAmount = ((years * 12 ) * monthlyAmount) + initialAmount;

    }
}


// Función que le pide al usuario un Objetivo de inversión para su portafolio de inversión;
const newUserGoal = () => {
    let userGoalEntry = prompt(`Crea un objetivo para tu Portafolio de inversiones. 
    Ejemplo: 
    ➡️ Comprar una casa 🏠
    ➡️ Comprar un automóvil 🚗
    ➡️ Viajar 🛫`);
    while(userGoalEntry == ''){
        userGoalEntry = prompt('¿Cuál es tu objetivo de inversión? Ejemplo: Comprar un auto 🚗');  
    }
    return userGoalEntry;
}

//Función que permite validar los datos ingresados por el usuario
const entryValidation = (input, maxInput) => {
    if(isNaN(input)|| input < 1 || input > maxInput) {
        return false;
    }
    return true;
}

// Función que pide al usuario el perfil de riesgo y lo retorna validado
let newUser = ()=>{
    let userProfileEntry = parseInt(prompt(`Ingresa el numero del fondo en el que quieres invertir: 
    1) Conservador 
    2) Moderado  
    3) Arriesgado`));
    let validationProfile = entryValidation(userProfileEntry, 3);
    while(validationProfile === false) {
        userProfileEntry = parseInt(prompt(`Debes ingresar una opción válida:
        1) Conservador
        2) Moderado
        3) Arriesgado`));
        validationProfile = entryValidation(userProfileEntry, 3);
    }
    return userProfileEntry;

}

//Función que pide al usuario los años de inversión y los retorna validados
const newYearInvest = () => {
    let userYearsInvestEntry = parseInt(prompt("Ingresa la cantidad de años de inversión. Ejemplo: 5"));
    let validationYears = entryValidation(userYearsInvestEntry, 51);
    while(validationYears === false) {
        userYearsInvestEntry = parseInt(prompt('Debes ingresar un año entre 1 y 50.'));
        validationYears = entryValidation(userYearsInvestEntry, 51);
    }
    return userYearsInvestEntry;
}

//Función que pide al usuario el monto inicial de inversión y lo retorna validado.
const newInitialUserAmount = () => {
    let initialUserAmountEntry = parseInt(prompt('Ingresa el monto inicial de inversión. Ejemplo: 400'));
    let validationAmount = entryValidation(initialUserAmountEntry);
    while(validationAmount === false) {
    initialUserAmountEntry = parseInt(prompt('Debes ingresar un monto valido.'));
    validationAmount = entryValidation(initialUserAmountEntry);
    }
    return initialUserAmountEntry;
}


//Función que pide al usuario el monto mensual de inversión y lo retorna validado.
const newMonthlyUserAmount = () => {
    let monthlyUserAmountEntry = parseInt(prompt('Ingresa el monto mensual que deseas invertir. Ejemplo 50'));
    let validationMonthly = entryValidation(monthlyUserAmountEntry);

    while(validationMonthly === false) {
        monthlyUserAmountEntry = parseInt(prompt('Debes ingresar un monto valido.'));
        validationMonthly = entryValidation(monthlyUserAmountEntry);
    }
    return monthlyUserAmountEntry;
}
// Llamada a las funciones para iniciar el algoritmo 
let userGoal = newUserGoal();
// Se instancia el objeto de la clase portafolio
let investSimulation = new portfolio(userGoal);
investSimulation.addSimulation();



/*Esta función comprueba si el usuario quiere otra simulación. Si el usuario lo desea se llama al método add.Simulation 
para iniciar nuevamente el proceso. Luego se llama a si misma para repetir la operación. 
Si el usuario no desea más simulaciones le muestra las simulaciones que tiene en su portfolio
*/
const otherInvest = () =>{
    let newInvest = confirm('Presiona "aceptar" si quieres una nueva simulación para tu portafolio o "cancelar" si quieres ver tu simulación.');
    if(newInvest === true){
        investSimulation.addSimulation();
        otherInvest();
    
    }else{
        investSimulation.dbPortfolio.forEach((el, index)=>{
            alert(`La simulación ${index+1} está en el fondo ${el.fundName} 💵.
            ➡️ En ${el.years} años invertirías un total de $ ${el.totalAmount} pesos.
            ➡️ Al final del periodo tendrías $${el.returns[0].at(-1)} pesos 😊.
            ➡️ En un escenario optimista tendrías $${el.returns[1].at(-1)} pesos.
            ➡️ En el escenario pesimista tendrías: $${el.returns[2].at(-1)} pesos.`);
        
        });
    
    }

}
otherInvest();
/*Función que muestra las simulaciones que existen en dbPortafolio, llamá a la función simulationToBeRemoved y dependiendo de lo que contenga esta
elimina o no una simulación*/
const remove = () =>{
    let element = "";
    investSimulation.dbPortfolio.forEach((el, index) =>{
        element += `➡️ ${index+1} simulación realizada en el fondo ${el.fundName} \n`
    });
    let removed = simulationToBeRemoved(element);
    if(removed != false){
        investSimulation.removeSimulation(removed-1);
        alert(`Se ha eliminado exitosamente la simulación ${removed}`);
        alert(`Si quieres seguir simulando o invertir debes crearte una cuenta 😁`)
    }

}

//Función que le pregunta al usuario si quiere eliminar una simulación.
const simulationToBeRemoved = (item) => {
    let userAnswer = confirm(`¿Quieres eliminar alguna simulación de tu portafolio?`)
    if(userAnswer === true) {
        let toRemove = parseInt(prompt(`Ingresa el número de la simulación que desea eliminar: 
        ${item}`));
        let validationRemove = entryValidation(toRemove, investSimulation.dbPortfolio.length);
        while(validationRemove === false) {
            toRemove = parseInt(prompt(`Opción invalida. Ingresa el número de la simulación que desea eliminar: 
        ${item}`));
            validationRemove = entryValidation(toRemove, investSimulation.dbPortfolio.length);
        }
        
        return toRemove;
    }else{
        alert(`Entendido. Si quieres seguir simulando o invertir debes crearte una cuenta 😁`);
        return false;
    }

}

remove();
console.log(investSimulation.dbPortfolio);