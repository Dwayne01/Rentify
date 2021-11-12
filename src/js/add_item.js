let enteredItems = [];

class rentItem {
    constructor(tCity, tCostDay, tCostMonth, tCostYear, tCategory, tCondition, tCity, tProvince, tPostalCode, tStartDate, tEndDate, 
        tDeposit, tDescription) {
        this.Title = tTitle;
        this.CostDay = tCostDay;
        this.CostMonth = tCostMonth;
        this.CostYear = tCostYear;
        this.Category = tCategory;
        this.Condition = tCondition;
        this.City = tCity;
        this.Province = tProvince;
        this.PostalCode= tPostalCode;
        this.StartDate = tStartDate;
        this.EndDate = tEndDate;
        this.Deposit = tDeposit;
        this.Description = tDescription;
    }
};

// Todo: Code for taking the files related to the item


// Todo: Change the form names and keep them short and import here

// function of Submit button
document.getElementById("submitbtn").addEventListener('click', ()=>{
    let newItem = new rentItem();
    enteredItems.push(rentItem);
    // console.log(enteredItems);

})