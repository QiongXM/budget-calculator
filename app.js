var budgetController = (function () {
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (cur) {
      sum = sum + cur.value;
    });

    data.totals[type] = sum;

  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    addItem: function (type, des, val) {
      var newItem, id;

      if (data.allItems[type].length > 0) {
        id = data.allItems[type][data.allItems[type].length - 1].id + 1
      } else {
        id = 0;
      }


      if (type === 'exp') {
        newItem = new Expense(id, des, val);
      } else if (type === 'inc') {
        newItem = new Income(id, des, val);
      }

      data.allItems[type].push(newItem);

      return newItem;

    },
    calculateBudget: function () {
      // calculate total income and expenses
      calculateTotal('inc');
      calculateTotal('exp');
      // calculate the budget: income - expeneses
      data.budget = data.totals.inc - data.totals.exp;
      // calculate the percentage of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }

    },

    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },

    testing: function () {
      console.log(data);
    }
  }
})();

var UIController = (function () {
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list'
  };
  return {
    getinput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: +document.querySelector(DOMstrings.inputValue).value
      };
    },
    addListItem: function (obj, type) {
      var html, element;
      if (type === 'inc') {
        element = DOMstrings.incomeContainer;
        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      } else if (type === 'exp') {
        element = DOMstrings.expenseContainer;
        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }

      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

    },
    clearFields: function () {
      var fields, fieldsArr;
      fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function (current, index, array) {
        current.value = "";
      });

      fieldsArr[0].focus();
    },
    getDOMstrings: function () {
      return DOMstrings;
    }
  };
})();

var controller = (function (budgetCtrl, UIContrl) {
  var DOM = UIContrl.getDOMstrings();
  var setupEventListeners = function () {
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function (event) {
      if (event.keycode == 13 || event.which == 13) {
        ctrlAddItem();
      }
    });
  };


  var updateBudget = function () {
    // 1. Calculate the budget
    budgetCtrl.calculateBudget();
    // 2. Return the budget
    var budget = budgetCtrl.getBudget();
    // 3. Display the budget on the UI
    console.log(budget);
  };

  var ctrlAddItem = function () {
    // 1. Get the field input data
    var input, newItem;
    input = UIContrl.getinput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

      // 2. Add the item to the budget controller
      var newItem = budgetController.addItem(input.type, input.description, input.value);

      // var html = '<h1>%in%</h1>';
      // newHtml = html.replace('%in%', input.value);
      // element = DOM.incomeContainer;
      // document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)

      // 3. Add the item to the UI
      UIContrl.addListItem(newItem, input.type);

      // 4. Clear the fields
      UIContrl.clearFields();


      //5. Calculate and update budget.
      updateBudget();

    }

  };

  return {
    init: function () {
      console.log('Applicaiton has started.');
      setupEventListeners();
    }
  };
})(budgetController, UIController);

controller.init();