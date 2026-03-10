$(document).ready(function() {
    
    // 1. Inicjalizacja Drag & Drop (jQuery UI)
    $("#shopping-list").sortable({
        update: function() {
            saveToLocal(); // Zapisz kolejność po przeciągnięciu
        }
    });

    // --- FUNKCJE LOCAL STORAGE ---

    // Funkcja zapisująca listę do pamięci przeglądarki
    function saveToLocal() {
        let items = [];
        $('#shopping-list li').each(function() {
            // Pobieramy tekst (jeśli trwa edycja, bierzemy wartość z inputa, jeśli nie - tekst z li)
            let text = $(this).find('input').length ? $(this).find('input').val() : $(this).text();
            items.push(text);
        });
        localStorage.setItem('myShoppingList', JSON.stringify(items));
    }

    // Funkcja wczytująca listę przy starcie
    function loadFromLocal() {
        let savedItems = localStorage.getItem('myShoppingList');
        if (savedItems) {
            let items = JSON.parse(savedItems);
            items.forEach(text => {
                $('#shopping-list').append(createListItem(text));
            });
        }
    }

    // --- LOGIKA LISTY ---

    // Funkcja pomocnicza generująca nowy element <li>
    function createListItem(text) {
        return $('<li>')
            .addClass('list-group-item d-flex justify-content-between align-items-center')
            .text(text);
    }

    // Wczytaj dane na starcie
    loadFromLocal();

    // Dodawanie produktu
    $('#btn-add, #btn-append').click(function() {
        let value = $('#item-input').val().trim();
        if (value) {
            $('#shopping-list').append(createListItem(value));
            $('#item-input').val('');
            saveToLocal();
        }
    });

    // Dodawanie na początku
    $('#btn-prepend').click(function() {
        let value = $('#item-input').val().trim();
        if (value) {
            $('#shopping-list').prepend(createListItem(value));
            $('#item-input').val('');
            saveToLocal();
        }
    });

    // Usuń ostatni produkt
    $('#btn-remove-last').click(function() {
        $('#shopping-list li').last().remove();
        saveToLocal();
    });

    // Wyczyść listę
    $('#btn-clear').click(function() {
        $('#shopping-list').empty();
        saveToLocal();
    });

    // Przywróć listę (Przykładowe dane)
    $('#btn-restore').click(function() {
        let defaultItems = `
            <li class="list-group-item">Chleb</li>
            <li class="list-group-item">Mleko</li>
            <li class="list-group-item">Pomidory</li>
        `;
        $('#shopping-list').html(defaultItems);
        saveToLocal();
    });

    // Edycja i klasa active
    $('#shopping-list').on('click', 'li', function(e) {
        if (e.target.tagName === 'INPUT') return;

        $(this).addClass('active');

        let currentText = $(this).text();
        let input = $('<input>')
            .attr('type', 'text')
            .addClass('form-control edit-input')
            .val(currentText);
        
        $(this).html(input);
        input.focus();
    });

    // Zapisanie edycji po Enter
    $('#shopping-list').on('keypress', '.edit-input', function(e) {
        if (e.which === 13) {
            let newText = $(this).val();
            let $li = $(this).parent();

            $li.fadeOut(200, function() {
                $li.text(newText).fadeIn(200);
                $li.removeClass('active');
                saveToLocal(); // Zapisz po edycji
            });
        }
    });

    // Kolorowanie co drugiego
    $('#btn-color-even').click(function() {
        $('#shopping-list li').css('background-color', '');
        $('#shopping-list li:even').css('background-color', '#f1f3f5');
    });

    // Sortowanie
    $('#btn-sort').click(function() {
        let items = $('#shopping-list li').get();
        items.sort(function(a, b) {
            return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
        });
        $.each(items, function(i, item) { $('#shopping-list').append(item); });
        saveToLocal();
    });

    // Filtrowanie (nie wymaga zapisu w LocalStorage)
    $('#filter-input').on('keyup', function() {
        let val = $(this).val().toLowerCase();
        $('#shopping-list li').each(function() {
            $(this).toggle($(this).text().toLowerCase().includes(val));
        });
    });
});