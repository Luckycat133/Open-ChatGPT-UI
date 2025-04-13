// JavaScript for potential future interactions

document.addEventListener('DOMContentLoaded', () => {
    const temporaryButton = document.querySelector('.temporary-button');
    const chatContainer = document.querySelector('.chat-container'); // Target the main container
    const actionButtons = document.querySelectorAll('.input-actions .action-button');
    const micButton = document.querySelector('.mic-button');
    const recordingButton = document.querySelector('.recording-button');
    const searchButton = document.querySelector('.search-button'); // Get search button specifically
    const plusButton = document.querySelector('.plus-button');
    const inputActionsContainer = document.querySelector('.input-actions-container');

    // --- Temporary Mode Toggle ---
    if (temporaryButton && chatContainer) {
        temporaryButton.addEventListener('click', () => {
            chatContainer.classList.toggle('temporary-active');
            temporaryButton.classList.toggle('active');
        });
    }
    
    // Set search button as selected by default
    if (searchButton) {
        searchButton.classList.add('selected');
    }
    
    // Hide input actions container by default
    if (inputActionsContainer) {
        inputActionsContainer.style.display = 'none';
    }
    
    // Toggle input actions when plus button is clicked
    if (plusButton && inputActionsContainer) {
        plusButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent event from bubbling up
            inputActionsContainer.style.display = inputActionsContainer.style.display === 'none' ? 'block' : 'none';
        });
        
        // Hide input actions when clicking outside
        document.addEventListener('click', (event) => {
            if (!inputActionsContainer.contains(event.target) && event.target !== plusButton) {
                inputActionsContainer.style.display = 'none';
            }
        });
    }

    // --- Action Button Selection (Example: Search) ---
    actionButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Don't select the '+' button
            if (button.classList.contains('plus-button')) {
              return;
            }

            // Remove 'selected' from all other buttons
            actionButtons.forEach(btn => {
                if (btn !== button) {
                    btn.classList.remove('selected');
                }
            });
            // Toggle 'selected' on the clicked button
            button.classList.toggle('selected');
        });
    });

    // --- Mic/Recording Toggle (Example) ---
    if (micButton && recordingButton) {
      micButton.addEventListener('click', () => {
        micButton.style.display = 'none';
        recordingButton.style.display = 'flex'; // Use flex as it's a flex item
        // Add actual recording start logic here
      });

      recordingButton.addEventListener('click', () => {
        recordingButton.style.display = 'none';
        micButton.style.display = 'flex';
        // Add actual recording stop logic here
      });
    }

    // --- Tooltip Logic (Keep existing example, might need adjustments) ---
    const newChatButton = document.querySelector('.new-chat-button');
    const newChatTooltip = document.querySelector('.new-chat-tooltip');
    const moreButton = document.querySelector('.more-button');
    const moreOptionsTooltip = document.querySelector('.more-options-tooltip');

    // Basic hover display - positioning needs CSS/JS refinement
    // if (newChatButton && newChatTooltip) {
    //     newChatButton.addEventListener('mouseover', () => newChatTooltip.style.display = 'block');
    //     newChatButton.addEventListener('mouseout', () => newChatTooltip.style.display = 'none');
    // }

    // if (moreButton && moreOptionsTooltip) {
    //     moreButton.addEventListener('mouseover', () => moreOptionsTooltip.style.display = 'block');
    //     moreButton.addEventListener('mouseout', () => moreOptionsTooltip.style.display = 'none');
    //     // Add logic to position the tooltip near the button
    // }
});