var featuresList = [
  {
    name: 'Beds',
    type: 'number',
    show: 'farm',
  },
  {
    name: 'Baths',
    type: 'number',
    show: 'farm',
  },
  {
    name: 'Year Built',
    type: 'number',
    show: 'farm',
  },
  {
    name: 'Year Build Details',
    type: 'string',
    show: 'resi,rlse,rinc,farm',
  },
  {
    name: 'Year Built Effective',
    type: 'number',
    show: 'resi,rlse,rinc,mobi,farm',
  },
  {
    name: 'Year Built Source',
    type: 'string',
    show: 'resi,rlse,rinc,mobi',
  },
  {
    name: 'New Construction?',
    type: 'boolean',
    show: 'resi,rlse,rinc,mobi',
  },
  {
    name: 'Stories',
    type: 'number',
    show: 'mobi,farm,coms,coml',
  },
  {
    name: 'Stories Total',
    type: 'number',
    show: 'resi,rlse,rinc,mobi,farm,coms,coml',
  },
  {
    name: 'Tax',
    type: 'number',
    show: 'rinc',
  },
  {
    name: 'Tax year',
    type: 'number',
    show: 'rinc',
  },
  {
    name: 'Garage',
    type: 'boolean',
    show: 'resi,rlse,rinc,mobi,farm',
  },

  {
    name: 'Garage Spaces',
    type: 'number',
    show: 'resi,rlse,rinc,mobi,farm',
  },

  {
    name: 'Attached Garage?',
    type: 'boolean',
    show: 'resi,rlse,rinc,mobi,farm',
  },

  {
    name: 'Carport Spaces',
    type: 'number',
    show: 'resi,rlse,rinc,mobi,farm',
  },

  {
    name: 'Carport?',
    type: 'boolean',
    show: 'resi,rlse,rinc,mobi,farm',
  },

  {
    name: 'Parking Total',
    type: 'boolean',
    show: 'resi,rinc,mobi,farm,coms,buso',
  },

  {
    name: 'Covered Parking Spaces',
    type: 'number',
    show: 'resi,rlse,rinc,mobi,farm,coms,coml',
  },

  {
    name: 'Open Parking Spaces',
    type: 'number',
    show: 'resi,rlse,rinc,mobi,farm',
  },

  {
    name: 'Parking Features',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm',
  },

  {
    name: 'Cap Rate',
    type: 'number',
    show: 'coml',
  },

  {
    name: 'Net Operating Income',
    type: 'number',
    show: 'coml',
  },

  {
    name: 'Gross Income',
    type: 'number',
    show: 'rinc,coms,coml',
  },

  {
    name: 'Operating Expense',
    type: 'number',
    show: 'rinc,coms,coml',
  },

  {
    name: 'Gross Scheduled Income',
    type: 'number',
    show: 'rinc,coms,coml,buso',
  },

  {
    name: 'Income Includes',
    type: 'multiple',
    show: 'rinc,land',
    options: [{
      name: 'Laundry'
    }]
  },

  {
    name: 'Operating Expense Includes',
    type: 'multiple',
    show: 'rinc',
    options: [{
      name: 'Accounting'
    }]
  },

  {
    name: 'Number Of Units Leased',
    type: 'number',
    show: 'rinc,coms,coml',
  },

  {
    name: 'Number Of Units Month To Month',
    type: 'number',
    show: 'rinc,coms,coml',
  },

  {
    name: 'Number Of Units Vacant',
    type: 'number',
    show: 'rinc',
  },

  {
    name: 'Existing Lease Type',
    type: 'multiple',
    show: 'rinc,coml',
    options: [{
      name: 'Absolute Net'
    }]
  },

  {
    name: 'Units Furnished',
    type: 'string',
    show: 'rinc',
  },

  {
    name: 'Total Actual Rent',
    type: 'number',
    show: 'rinc,coms,coml',
  },

  {
    name: 'Number Of Units Total',
    type: 'number',
    show: 'rinc',
  },

  {
    name: 'Number Of Buildings',
    type: 'number',
    show: 'rinc,coms,coml',
  },

  {
    name: 'Owner Pays',
    type: 'string',
    show: 'rinc,land,coms,coml',
  },

  {
    name: 'Tenant Pays',
    type: 'string',
    show: 'rinc,land,coms,coml',
  },

  {
    name: 'Rent Includes',
    type: 'string',
    show: 'rlse,mobi',
  },

  {
    name: 'Furnished',
    type: 'string',
    show: 'rlse',
  },

  {
    name: 'Lot Size Area',
    type: 'number',
    show: 'resi,rlse,rinc,mobi,coms,coml,buso',
  },

  {
    name: 'Lot Size Acres',
    type: 'number',
    show: 'resi,rlse,rinc,mobi,coms,coml,buso',
  },

  {
    name: 'Lot Size Source',
    type: 'string',
    show: 'resi,rlse,rinc,land,mobi,farm,coms,coml,buso',
  },

  {
    name: 'Lot Dimensions Source',
    type: 'string',
    show: 'resi,rlse,rinc,land,mobi,farm,coms,coml,buso',
  },

  {
    name: 'Frontage Type',
    type: 'string',
    show: 'resi,rlse,rinc,land,mobi,farm,coms,coml,buso',
  },

  {
    name: 'Frontage Length',
    type: 'string',
    show: 'resi,rlse,rinc,land,mobi,farm,coms,coml,buso',
  },

  {
    name: 'Zoning',
    type: 'string',
    show: 'resi,rinc,land,mobi,farm',
  },

  {
    name: 'Zoning Description',
    type: 'string',
    show: 'resi,rlse,rinc,land,mobi,farm,coms,coml,buso',
  },

  {
    name: 'Water Source',
    type: 'string',
    show: 'resi,rlse,rinc,land,mobi,farm,coms,coml',
  },

  {
    name: 'Distance To Water',
    type: 'string',
    show: 'farm',
  },

  {
    name: 'Electric On Property?',
    type: 'boolean',
    show: 'land,farm',
  },

  {
    name: 'Distance To Electric',
    type: 'string',
    show: 'farm',
  },

  {
    name: 'Sewer',
    type: 'string',
    show: 'resi,rlse,rinc,land,mobi,farm,coms,coml',
  },

  {
    name: 'Distance To Sewer',
    type: 'string',
    show: 'land,farm',
  },

  {
    name: 'Distance To Gas',
    type: 'string',
    show: 'land,farm',
  },

  {
    name: 'Distance To Phone Service',
    type: 'string',
    show: 'land,farm',
  },

  {
    name: 'Distance To Street',
    type: 'string',
    show: 'land,farm',
  },

  {
    name: 'Distance To Schools',
    type: 'string',
    show: 'land,farm',
  },

  {
    name: 'Distance From Shopping',
    type: 'string',
    show: 'farm',
  },

  {
    name: 'Distance To Place of Worship',
    type: 'string',
    show: 'land,farm',
  },

  {
    name: 'Distance To Bus',
    type: 'string',
    show: 'land,farm',
  },

  {
    name: 'Distance From School Bus',
    type: 'string',
    show: 'land,farm',
  },

  {
    name: 'Distance To Freeway',
    type: 'string',
    show: 'land,farm',
  },

  {
    name: 'Crops Included?',
    type: 'boolean',
    show: 'farm',
  },

  {
    name: 'Pasture Area',
    type: 'number',
    show: 'farm',
  },

  {
    name: 'Range Area',
    type: 'number',
    show: 'farm',
  },

  {
    name: 'Wooded Area',
    type: 'number',
    show: 'farm',
  },

  {
    name: 'Vegetation',
    type: 'string',
    show: 'resi,rlse,rinc,land,mobi,farm',
  },

  {
    name: 'Fencing',
    type: 'string',
    show: 'resi,rlse,rinc,land,mobi,farm,coms,coml',
  },

  {
    name: 'Farm Land Area Units',
    type: 'string',
    show: 'farm',
  },

  {
    name: 'Building Area Total',
    type: 'number',
    show: 'resi,rlse,rinc,land,mobi,farm,coms,coml,buso',
  },

  {
    name: 'Building Area Source',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm',
  },

  {
    name: 'LeasableArea',
    type: 'number',
    show: 'coms',
  },

  {
    name: 'Possession',
    type: 'string',
    show: 'resi,rlse,rinc,land,mobi,farm,coms,coml,buso',
  },

  {
    name: 'Availability Date',
    type: 'date',
    show: 'rlse,coms,coml',
  },

  {
    name: 'MLS Area Major',
    type: 'string',
    show: 'resi,rlse,rinc,land,mobi,farm,coms,coml,buso',
  },

  {
    name: 'MLS Area Minor',
    type: 'string',
    show: 'resi,rlse,rinc,land,mobi,farm,coms,coml,buso',
  },

  {
    name: 'Subdivision Name',
    type: 'string',
    show: 'resi,rlse,rinc,land,mobi,farm,coms,coml,buso',
  },

  {
    name: 'Cross Street',
    type: 'string',
    show: 'resi,rlse,rinc,land,mobi,farm,coms,coml,buso',
  },

  {
    name: 'Pets Allowed',
    type: 'multiple',
    show: 'rlse,mobi',
    options: [{
      name: 'Yes'
    },{
      name: 'No'
    }]
  },

  {
    name: 'Lease Term',
    type: 'single',
    show: 'rlse',
    options: [{
      name: '12 Months'
    },{
      name: '24 Months'
    }]
  },

  {
    name: 'View',
    type: 'string',
    show: 'resi,rlse,rinc,land,mobi,farm',
  },

  {
    name: 'View?',
    type: 'boolean',
    show: 'resi,rlse,rinc,land,mobi,farm',
  },

  {
    name: 'Lot features',
    type: 'string',
    show: 'resi,rlse,rinc,land,mobi,farm',
  },

  {
    name: 'Current Use',
    type: 'string',
    show: 'land',
  },

  {
    name: 'Possible Use',
    type: 'string',
    show: 'land',
  },

  {
    name: 'Development Status',
    type: 'string',
    show: 'land',
  },

  {
    name: 'Community Features',
    type: 'string',
    show: 'resi,rlse,rinc,land,mobi,farm',
  },

  {
    name: 'Senior Community?',
    type: 'boolean',
    show: 'resi,rlse,rinc,land,mobi,farm',
  },

  {
    name: 'Pool Private?',
    type: 'boolean',
    show: 'resi,rlse,rinc,land,mobi,farm',
  },

  {
    name: 'Spa?',
    type: 'boolean',
    show: 'resi,rlse,rinc,land,mobi,farm',
  },

  {
    name: 'Waterfront?',
    type: 'boolean',
    show: 'resi,rlse,rinc,land,mobi,farm,coms,coml,buso',
  },

  {
    name: 'Water Body Name',
    type: 'string',
    show: 'resi,rlse,rinc,land,mobi,farm,coms,coml,buso',
  },

  {
    name: 'Business Name',
    type: 'string',
    show: 'buso',
  },

  {
    name: 'Business Type',
    type: 'multiple',
    show: 'coms,coml,buso',
    options: [{
      name: 'Accounting'
    }]
  },

  {
    name: 'Ownership Type',
    type: 'single',
    show: 'buso',
    options: [{
      name: 'Corporation'
    }]
  },

  {
    name: 'Special Licenses',
    type: 'multiple',
    show: 'buso',
    options: [{
      name: 'Beer/Wine'
    }]
  },

  {
    name: 'Number Of Full Time Employees',
    type: 'number',
    show: 'buso',
  },

  {
    name: 'Number Of Part Time Employees',
    type: 'number',
    show: 'buso',
  },

  {
    name: 'Lease Amount',
    type: 'number',
    show: 'buso',
  },

  {
    name: 'Lease Amount Frequency',
    type: 'single',
    show: 'buso',
    options: [{
      name: 'Daily'
    },{
      name: 'Weekly'
    }]
  },

  {
    name: 'Lease Expiration',
    type: 'boolean',
    show: 'buso',
  },

  {
    name: 'Lease Renewal Option?',
    type: 'boolean',
    show: 'buso',
  },

  {
    name: 'Lease Assignable?',
    type: 'boolean',
    show: 'buso',
  },

  {
    name: 'Hours Days of Operation Description',
    type: 'multiple',
    show: 'buso',
    options: [{
      name: 'Open 24 Hours'
    }]
  },

  {
    name: 'Years Current Owner',
    type: 'number',
    show: 'buso',
  },

  {
    name: 'Labor Information',
    type: 'string',
    show: 'buso',
  },

  {
    name: 'Utilities',
    type: 'string',
    show: 'resi,rlse,rinc,land,mobi,farm,coms,coml',
  },

  {
    name: 'Electric',
    type: 'string',
    show: 'resi,rlse,rinc,land,mobi,farm',
  },

  {
    name: 'Gas',
    type: 'string',
    show: 'resi,rlse,rinc,land,mobi,farm',
  },

  {
    name: 'Telephone',
    type: 'string',
    show: 'resi,rlse,rinc,land,mobi,farm',
  },

  {
    name: 'Irrigation Water Rights?',
    type: 'boolean',
    show: 'farm',
  },

  {
    name: 'Irrigation Water Rights Acres',
    type: 'number',
    show: 'farm',
  },

  {
    name: 'Irrigation Source',
    type: 'string',
    show: 'land,farm',
  },

  {
    name: 'Bedrooms Possible',
    type: 'number',
    show: 'resi,rlse,rinc,mobi,farm',
  },

  {
    name: 'Main Level Bedrooms',
    type: 'number',
    show: 'resi,rlse',
  },

  {
    name: 'Bathrooms Full',
    type: 'number',
    show: 'resi,rlse,rinc,land,mobi,farm,coms,coml,buso',
  },

  {
    name: 'Bathrooms Partial',
    type: 'number',
    show: 'resi,rlse,rinc,mobi,farm',
  },

  {
    name: 'Main Level Bathrooms',
    type: 'number',
    show: 'resi,rlse,rinc,mobi,farm',
  },

  {
    name: 'Property Attached?',
    type: 'boolean',
    show: 'resi,rlse,rinc,mobi,farm',
  },

  {
    name: 'Levels',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm',
  },

  {
    name: 'Make',
    type: 'string',
    show: 'resi,rlse,mobi',
  },

  {
    name: 'Model',
    type: 'string',
    show: 'resi,rlse,mobi',
  },

  {
    name: 'Living Area Source',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm',
  },

  {
    name: 'Above Grade Finished Area',
    type: 'number',
    show: 'resi,rlse,rinc,mobi,farm',
  },

  {
    name: 'Above Grade Finished Area Source',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm',
  },

  {
    name: 'Below Grade Finished Area',
    type: 'number',
    show: 'resi,rlse,rinc,mobi,farm',
  },

  {
    name: 'Below Grade Finished Area Source',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm',
  },

  {
    name: 'Common Walls',
    type: 'multiple',
    show: 'resi,rlse,rinc,mobi,farm',
    options: [{
      name: '1 Common Wall'
    }]
  },

  {
    name: 'Exclusions',
    type: 'string',
    show: 'resi,rlse,rinc,land,mobi,farm,coms,coml,buso',
  },

  {
    name: 'Inclusions',
    type: 'string',
    show: 'resi,rlse,rinc,land,mobi,farm,coms,coml,buso',
  },

  {
    name: 'Entry Location',
    type: 'string',
    show: 'resi,rlse,rinc,mobi',
  },

  {
    name: 'Entry Level',
    type: 'number',
    show: 'resi,rlse,rinc,mobi,farm,coms,coml',
  },

  {
    name: 'Green Building Verification Type',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm,coms,coml',
  },

  {
    name: 'Green Energy Efficient',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm,coms,coml',
  },

  {
    name: 'Green Location',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm,coms,coml',
  },

  {
    name: 'Walk Score',
    type: 'number',
    show: 'resi,rlse,rinc,land,mobi,farm',
  },

  {
    name: 'Builder Name',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm,coms,coml',
  },

  {
    name: 'Builder Model',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm',
  },

  {
    name: 'Building Name',
    type: 'string',
    show: 'coms,coml',
  },

  {
    name: 'Building Features',
    type: 'string',
    show: 'coms,coml',
  },

  {
    name: 'Heating',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm,coms,coml',
  },

  {
    name: 'Heating?',
    type: 'boolean',
    show: 'resi,rlse,rinc,land,mobi,farm,coms,coml',
  },

  {
    name: 'Cooling',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm,coms,coml',
  },

  {
    name: 'Cooling?',
    type: 'boolean',
    show: 'resi,rlse,rinc,land,mobi,farm,coms,coml',
  },

  {
    name: 'Interior Features',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm',
  },

  {
    name: 'Exterior Features',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm',
  },

  {
    name: 'Patio And Porch Features',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm',
  },

  {
    name: 'Property Condition',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm',
  },

  {
    name: 'Fireplace Features',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm',
  },

  {
    name: 'Fireplaces Total',
    type: 'number',
    show: 'resi,rlse,rinc,mobi,farm',
  },

  {
    name: 'Fireplace?',
    type: 'boolean',
    show: 'resi,rlse,rinc,mobi,farm',
  },

  {
    name: 'Door Features',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm',
  },

  {
    name: 'Window Features',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm',
  },

  {
    name: 'Roof',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm,coms,coml',
  },

  {
    name: 'Construction Materials',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm,coms,coml',
  },

  {
    name: 'Foundation Details',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm,coms,coml',
  },

  {
    name: 'Basement',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm',
  },

  {
    name: 'Flooring',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm,coms,coml',
  },

  {
    name: 'Other Structures',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm',
  },

  {
    name: 'Direction Faces',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm,coms,coml',
  },

  {
    name: 'Other Equipment',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm',
  },

  {
    name: 'Appliances',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm,coms,coml',
  },

  {
    name: 'Laundry Features',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm,coms,coml',
  },

  {
    name: 'Security Features',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm,coms,coml',
  },

  {
    name: 'Number Of Separate Electric Meters',
    type: 'number',
    show: 'rinc,farm',
  },

  {
    name: 'Number Of Separate Gas Meters',
    type: 'number',
    show: 'rinc,farm',
  },

  {
    name: 'Number Of Separate Water Meters',
    type: 'number',
    show: 'rinc,farm',
  },

  {
    name: 'Habitable Residence?',
    type: 'boolean',
    show: 'farm',
  },

  {
    name: 'Body Type',
    type: 'string',
    show: 'mobi',
  },

  {
    name: 'Park Name',
    type: 'string',
    show: 'mobi,coms,coml',
  },

  {
    name: 'Number Of Pads',
    type: 'number',
    show: 'mobi',
  },

  {
    name: 'Accessibility Features',
    type: 'string',
    show: 'resi,rlse,rinc,mobi,farm,coms,coml',
  },

  {
    name: 'Rooms Total',
    type: 'number',
    show: 'resi,rlse,rinc,mobi,farm',
  },

];

var featureObject = '';
featureObject +=  '<li class="dd-item feature-text" data-id="">';
featureObject +=    '<div class="dd-handle"></div>';
featureObject +=      '<div class="dd-content">';
featureObject +=        '<div class="left-content">';
featureObject +=          '<select class="selectpicker wsb-select one-arrow">';
featureObject +=          '</select>';
featureObject +=       '</div>';
featureObject +=      '<div class="right-content">';
featureObject +=        '<a href="#" class="del-btn show-on-edit"><i class="fa fa-trash"></i></a>';
featureObject +=      '</div>';
featureObject +=    '</div>';
featureObject +=  '</li>';

String.prototype.format = function () {
  var args = arguments;
  return this.replace(/\{\{|\}\}|\{(\d+)\}/g, function (m, n) {
    if (m == "{{") { return "{"; }
    if (m == "}}") { return "}"; }
    return args[n] ? args[n] : "";
  });
}

var textTemplate = '<input type="text" placeholder="Input Text" class="input-editable feature-value text-right form-control">';
var numberTemplate = '<input type="number" placeholder="Input Number" class="input-editable feature-value text-right form-control">';
var selectTemplate = '<select class="selectpicker wsb-select one-arrow"></select>';
var yesnoTemplate = '<div class="wsb-radio selected">';
    yesnoTemplate +=  '<label><input type="radio" checked><span class="fake-input"></span></label>YES';
    yesnoTemplate +='</div>';
    yesnoTemplate +='<div class="wsb-radio">';
    yesnoTemplate +=    '<label><input type="radio"><span class="fake-input"></span></label>NO';
    yesnoTemplate +='</div>';
var dateTemplate = '<div class="form-group calendar-holder mb-md">';
    dateTemplate +=  '<input type="text" id="datepicker" class="form-control wb-datepicker" placeholder="Date">';
    dateTemplate +=  '<a href="#" class="btn btn-default btn-calendar">';
    dateTemplate +=    '<i class="fa fa-calendar"></i>';
    dateTemplate +=  '</a>';
    dateTemplate +='</div>';
var templates = {
  number: numberTemplate,
  string: textTemplate,
  multiple: selectTemplate,
  single: selectTemplate,
  boolean: yesnoTemplate,
  date: dateTemplate
};

;(function ($) {
//LISTING FEATURES
  var addNewFeature = function(i){
    var featureObj = $(featureObject);
    for (var j=0; j<featuresList.length; j++){

      //left side template
      var option = featuresList[j];
      var selected = (i == j) ? 'selected' : '';
      var selectOption = '<option data-show-for="'+option.show+'" value="'+option.name+'" '+selected+' ">'+option.name+'</option>';
      featureObj.find('.left-content .selectpicker').append(selectOption);
      if (i == j){
        featureObj.attr('data-show-for', option.show);
      }
    }

    //right side template
    var rightSideTemplate = templates[featuresList[i].type];
    featureObj.find('.right-content').prepend(rightSideTemplate);

    $('.features-group .dd-list').append(featureObj);
  };

  for (var i=0; i<10; i++){
    addNewFeature(i);

    if (i==9){
      $('.features-group .selectpicker').selectpicker();
    }
  };

  $('body').on('change', '.features-group .left-content select', function(){
    var val = $(this).val();
    for (var i=0; i<featuresList.length; i++){
      if (val == featuresList[i].name){
        var rightSideTemplate = $(templates[featuresList[i].type]);
        if (featuresList[i].type == 'multiple' || featuresList[i].type == 'single'){
          for (var j=0; j<featuresList[i].options.length; j++){
            var option = featuresList[i].options[j];
            var selectOption = '<option value="'+option.name+'">'+option.name+'</option>';
            rightSideTemplate.append(selectOption);
          }
        }
        var rightSide = $(this).parents('li').find('.right-content');
        rightSide.html('<a href="#" class="del-btn show-on-edit"><i class="fa fa-trash"></i></a>');
        rightSide.prepend(rightSideTemplate);
        if (featuresList[i].type == 'multiple' || featuresList[i].type == 'single'){
          rightSide.find('.selectpicker').selectpicker();
        }
        if (featuresList[i].type == 'date'){
          rightSide.find('.wb-datepicker').datepicker({
              'autoclose': true,
              'format': 'M d, yyyy',
          });
        }
      }
    }

      var selectedOption = $(this).find('option:selected');
      console.log($(this).val());
      var showFor = selectedOption.attr('data-show-for');
      $(this).parents('li').attr('data-show-for', showFor);
  });

  $('body').on('click', '.features-group .del-btn', function(){
    $(this).parents('li').remove();
  });

  $('.add-feature').on('click', function(){
    addNewFeature(0);
    $('.features-group li:last-child .selectpicker').selectpicker();
  });

  var showHideProperty = function(){
    var property = $('#res-property').val();
    $('[data-show-for]').each(function(){
      var isShow = false;
      var propertiesList = $(this).attr('data-show-for').split(',');
      for (var i=0; i<propertiesList.length; i++){
        if (propertiesList[i] == property){
          isShow = true;
        }
      }
      if (isShow){ 
        if ($(this).is('li')){
          var container = $(this).parents('.list-wrapper').find('.shown-elm');
          $(this).detach().appendTo(container);
        }
        else{
          $(this).show(); 
        }
      }
      else { 
       if ($(this).is('li')){
          var container = $(this).parents('.list-wrapper').find('.hidden-elm');
          $(this).detach().appendTo(container);
        }
        else{
          $(this).hide(); 
        }
      }
    });
    $('.selectpicker').selectpicker('refresh');
  };

  $('#res-property').on('change', function(){
    showHideProperty();
  });

}(jQuery));
