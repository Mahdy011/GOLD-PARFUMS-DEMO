document.addEventListener("DOMContentLoaded", function () {

    // Prix des parfums
    const prices = {
        "Yara": 45,
        "D&G Devotion": 75,
        "Delina": 75,
        "Interdit": 75,
        "Kayali": 45,
        "My Burberry": 75,
        "Prada": 45
    };

    // Numero WhatsApp mta3 el boutique
    const WHATSAPP_NUMBER = "21628442260";

    // Lire le panier
    function getCart() {
        try {
            const cart = JSON.parse(localStorage.getItem("goldCart"));
            return Array.isArray(cart) ? cart : [];
        } catch (error) {
            return [];
        }
    }

    // Sauvegarder le panier
    function saveCart(cart) {
        localStorage.setItem("goldCart", JSON.stringify(cart));
    }

    // Mettre a jour le nombre de produits
    function updateCartCount() {
        const countElement = document.getElementById("cart-count");
        if (!countElement) return;

        const count = getCart().reduce(function (sum, item) {
            return sum + (Number(item.qty) || 0);
        }, 0);

        countElement.textContent = count;
    }

    // Message de confirmation d'ajout
    function showCartMessage(name) {
        let message = document.getElementById("cart-message");

        if (!message) {
            message = document.createElement("p");
            message.id = "cart-message";
            message.setAttribute("role", "status");

            const products = document.querySelector(".products") ||
                             document.querySelector("#produits") ||
                             document.querySelector("main");

            if (products) {
                products.prepend(message);
            }
        }

        if (message) {
            message.textContent = name + " tzad lel panier !";
            message.style.display = "block";
            message.style.color = "#b18a43";
            message.style.fontWeight = "bold";
        }
    }

    // AJOUTER UN PRODUIT AU PANIER
    // Capture l'evenement pour eviter les anciennes redirections.
    document.addEventListener("click", function (event) {
        const button = event.target.closest(
            ".product-card .order-button"
        );

        if (!button) return;

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        const card = button.closest(".product-card");
        const title = card ? card.querySelector("h3") : null;

        if (!title) {
            alert("Ma najamnech nal9aw esm el parfum.");
            return;
        }

        const name = title.textContent.trim();

        if (!Object.prototype.hasOwnProperty.call(prices, name)) {
            alert("Esm el parfum mawjoudch fi liste des prix: " + name);
            console.error("Nom du produit non reconnu:", name);
            return;
        }

        const cart = getCart();

        const existing = cart.find(function (item) {
            return item.name === name;
        });

        if (existing) {
            existing.qty = (Number(existing.qty) || 0) + 1;
        } else {
            cart.push({
                name: name,
                qty: 1
            });
        }

        // Sauvegarder AVANT d'ouvrir le panier
        saveCart(cart);
        updateCartCount();
        showCartMessage(name);

        // Aller au panier apres l'ajout
        window.location.href = "panier.html";

    }, true);

    // Navigation fluide des liens internes
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    // Verifier les images
    document.querySelectorAll(
        ".product-card img, .brand img"
    ).forEach(function (img) {
        img.addEventListener("error", function () {
            console.warn(
                "Image introuvable :",
                img.getAttribute("src")
            );
        });
    });

    // Formulaire de commande classique, ken mawjoud fi page
    const orderForm = document.getElementById("order-form");
    const parfumSelect = document.getElementById("parfum");
    const quantityInput = document.getElementById("quantite");
    const messageElement = document.getElementById("order-message");
    const totalElement = document.getElementById("order-total");

    function updateTotal() {
        if (!parfumSelect || !quantityInput || !totalElement) return;

        const parfum = parfumSelect.value;
        const quantity = Number(quantityInput.value);
        const price = prices[parfum] || 0;

        totalElement.textContent =
            (quantity > 0 ? price * quantity : 0) + " DT";
    }

    if (parfumSelect) {
        parfumSelect.addEventListener("change", updateTotal);
    }

    if (quantityInput) {
        quantityInput.addEventListener("input", updateTotal);
    }

    if (orderForm) {
        orderForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const nomElement = document.getElementById("nom");
            const telephoneElement = document.getElementById("telephone");
            const adresseElement = document.getElementById("adresse");

            if (!nomElement || !telephoneElement || !adresseElement ||
                !parfumSelect || !quantityInput) {
                return;
            }

            const nom = nomElement.value.trim();
            const telephone = telephoneElement.value.trim();
            const adresse = adresseElement.value.trim();
            const parfum = parfumSelect.value;
            const quantite = Number(quantityInput.value);

            if (!nom || !telephone || !adresse || !parfum) {
                if (messageElement) {
                    messageElement.textContent =
                        "3abbi les champs lkol 3aychek.";
                }
                return;
            }

            if (!Number.isInteger(quantite) ||
                quantite < 1 || quantite > 20) {
                if (messageElement) {
                    messageElement.textContent =
                        "El quantite lezem tkoun bin 1 w 20.";
                }
                return;
            }

            const total = (prices[parfum] || 0) * quantite;

            const texte =
                "Bonjour Gold Parfum !\n\n" +
                "Nom : " + nom + "\n" +
                "Téléphone : " + telephone + "\n" +
                "Adresse : " + adresse + "\n" +
                "Parfum : " + parfum + "\n" +
                "Quantité : " + quantite + "\n" +
                "Total estimé : " + total + " DT";

            const url =
                "https://wa.me/" + WHATSAPP_NUMBER +
                "?text=" + encodeURIComponent(texte);

            window.open(url, "_blank");
        });

        updateTotal();
    }

    // Afficher le nombre actuel dans le panier
    updateCartCount();

});