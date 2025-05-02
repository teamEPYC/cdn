  // JavaScript to handle dropdown functionality for multiple forms
document.addEventListener('DOMContentLoaded', function() {
  // First script: Handle all custom dropdowns
  const selectWrappers = document.querySelectorAll('.custom-select-wrapper');
  
  selectWrappers.forEach(selectWrapper => {
    const selectDisplay = selectWrapper.querySelector('.custom-select-display');
    const optionsList = selectWrapper.querySelector('.custom-options-list');
    const options = selectWrapper.querySelectorAll('.custom-option');
    const hiddenSelect = selectWrapper.querySelector('.hidden-select');
    
    if (!selectDisplay || !optionsList || !options.length || !hiddenSelect) return;
    
    // Toggle dropdown when clicking on the display
    selectDisplay.addEventListener('click', function(e) {
      e.stopPropagation();
      
      // Close all other open dropdowns first
      selectWrappers.forEach(wrapper => {
        if (wrapper !== selectWrapper && wrapper.classList.contains('active')) {
          wrapper.classList.remove('active');
        }
      });
      
      selectWrapper.classList.toggle('active');
    });
    
    // Handle option selection
    options.forEach(option => {
      option.addEventListener('click', function() {
        const value = this.getAttribute('data-value');
        const text = this.textContent.trim();
        
        // Update display text
        selectDisplay.innerHTML = text + ' <span class="chevron"></span>';
        
        // Update hidden select value
        for (let i = 0; i < hiddenSelect.options.length; i++) {
          if (hiddenSelect.options[i].value === value) {
            hiddenSelect.selectedIndex = i;
            break;
          }
        }
        
        // Trigger change event on the select
        const event = new Event('change', { bubbles: true });
        hiddenSelect.dispatchEvent(event);
        
        // Close dropdown
        selectWrapper.classList.remove('active');
        
        // Find the associated form and hide any error state
        const form = selectWrapper.closest('form');
        if (form) {
          const errorState = form.querySelector('.industry-error-state');
          if (errorState) {
            errorState.style.display = 'none';
          }
        }
      });
    });
  });
  
  // Close all dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    selectWrappers.forEach(wrapper => {
      if (!wrapper.contains(e.target)) {
        wrapper.classList.remove('active');
      }
    });
  });

  // Second script: Handle industry forms validation
  const industryForms = document.querySelectorAll("form[isindustryform='true']");
  
  industryForms.forEach(form => {
    const hiddenSelect = form.querySelector(".hidden-select");
    const errorState = form.querySelector(".industry-error-state");
    const display = form.querySelector(".custom-select-display");
    
    if (!hiddenSelect || !errorState || !display) return;
    
    // Reset select on page load (including back nav)
    window.addEventListener("pageshow", () => {
      hiddenSelect.selectedIndex = 0;
      hiddenSelect.value = "";
      display.textContent = "Select Industry*";
    });
    
    // Prevent form submission if no industry is selected
    form.addEventListener("submit", function(e) {
      if (!hiddenSelect.value || hiddenSelect.selectedIndex === 0) {
        e.preventDefault();
        e.stopImmediatePropagation();
        errorState.style.display = "block";
        errorState.scrollIntoView({ behavior: "smooth", block: "center" });
        return false;
      }
    });
  });
  
  // Hide error on any interaction - but only for the appropriate form
  document.addEventListener("click", (e) => {
    const clickedForm = e.target.closest('form[isindustryform="true"]');
    if (clickedForm) {
      const errorState = clickedForm.querySelector('.industry-error-state');
      if (errorState) {
        errorState.style.display = 'none';
      }
    }
  });
});
