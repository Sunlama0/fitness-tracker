document.addEventListener("DOMContentLoaded", function() {
    const steps = document.querySelectorAll(".step");
    const nextBtn = document.getElementById("nextStep");
    const prevBtn = document.getElementById("prevStep");
    const submitBtn = document.getElementById("submitBtn");
    const progressBar = document.getElementById("progressBar");

    let currentStep = 0;

    function updateStep() {
        steps.forEach((step, index) => {
            step.classList.remove("show");
            step.classList.toggle("hidden", index !== currentStep);
        });

        setTimeout(() => {
            steps[currentStep].classList.add("show");
        }, 100);

        prevBtn.classList.toggle("hidden", currentStep === 0);
        nextBtn.classList.toggle("hidden", currentStep === steps.length - 1);
        submitBtn.classList.toggle("hidden", currentStep !== steps.length - 1);

        progressBar.style.width = ((currentStep + 1) / steps.length) * 100 + "%";

        // Prévisualisation des données à la dernière étape
        if (currentStep === steps.length - 1) {
            updatePreview();
        }
    }

    nextBtn.addEventListener("click", function() {
        if (validateStep()) {
            if (currentStep < steps.length - 1) {
                currentStep++;
                updateStep();
            }
        }
    });

    prevBtn.addEventListener("click", function() {
        if (currentStep > 0) {
            currentStep--;
            updateStep();
        }
    });

    function validateStep() {
        const inputs = steps[currentStep].querySelectorAll("input, select");
        let isValid = true;

        inputs.forEach(input => {
            if (input.hasAttribute("required") && !input.value.trim()) {
                input.classList.add("border-red-500");
                isValid = false;
            } else {
                input.classList.remove("border-red-500");
            }
        });

        return isValid;
    }

    function updatePreview() {
        document.getElementById("previewFirstName").innerText = document.querySelector("input[name='firstName']").value;
        document.getElementById("previewLastName").innerText = document.querySelector("input[name='lastName']").value;
        document.getElementById("previewEmail").innerText = document.querySelector("input[name='email']").value;
        document.getElementById("previewBirthDate").innerText = document.querySelector("input[name='birthDate']").value;
        document.getElementById("previewCity").innerText = document.querySelector("input[name='city']").value;
        document.getElementById("previewGender").innerText = document.querySelector("select[name='gender']").value;
    }

    updateStep();
});
