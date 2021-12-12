export default function bindEvents(jexcel) {

    jexcel.keyDownControls = function (e) {
        if (jexcel.current) {
            if (jexcel.current.edition) {
                if (e.which == 27) {
                    // Escape
                    if (jexcel.current.edition) {
                        // Exit without saving
                        jexcel.current.closeEditor(jexcel.current.edition[0], false);
                    }
                    e.preventDefault();
                } else if (e.which == 13) {
                    // Enter
                    if (jexcel.current.options.columns[jexcel.current.edition[2]].type == 'calendar') {
                        jexcel.current.closeEditor(jexcel.current.edition[0], true);
                    } else if (jexcel.current.options.columns[jexcel.current.edition[2]].type == 'dropdown' ||
                        jexcel.current.options.columns[jexcel.current.edition[2]].type == 'autocomplete') {
                        // Do nothing
                    } else {
                        // Alt enter -> do not close editor
                        if ((jexcel.current.options.wordWrap == true ||
                            jexcel.current.options.columns[jexcel.current.edition[2]].wordWrap == true ||
                            jexcel.current.options.data[jexcel.current.edition[3]][jexcel.current.edition[2]].length > 200) && e.altKey) {
                            // Add new line to the editor
                            var editorTextarea = jexcel.current.edition[0].children[0];
                            var editorValue = jexcel.current.edition[0].children[0].value;
                            var editorIndexOf = editorTextarea.selectionStart;
                            editorValue = editorValue.slice(0, editorIndexOf) + "\n" + editorValue.slice(editorIndexOf);
                            editorTextarea.value = editorValue;
                            editorTextarea.focus();
                            editorTextarea.selectionStart = editorIndexOf + 1;
                            editorTextarea.selectionEnd = editorIndexOf + 1;
                        } else {
                            jexcel.current.edition[0].children[0].blur();
                        }
                    }
                } else if (e.which == 9) {
                    // Tab
                    if (jexcel.current.options.columns[jexcel.current.edition[2]].type == 'calendar') {
                        jexcel.current.closeEditor(jexcel.current.edition[0], true);
                    } else {
                        jexcel.current.edition[0].children[0].blur();
                    }
                }
            }

            if (!jexcel.current.edition && jexcel.current.selectedCell) {
                // Which key
                if (e.which == 37) {
                    jexcel.current.left(e.shiftKey, e.ctrlKey);
                    e.preventDefault();
                } else if (e.which == 39) {
                    jexcel.current.right(e.shiftKey, e.ctrlKey);
                    e.preventDefault();
                } else if (e.which == 38) {
                    jexcel.current.up(e.shiftKey, e.ctrlKey);
                    e.preventDefault();
                } else if (e.which == 40) {
                    jexcel.current.down(e.shiftKey, e.ctrlKey);
                    e.preventDefault();
                } else if (e.which == 36) {
                    jexcel.current.first(e.shiftKey, e.ctrlKey);
                    e.preventDefault();
                } else if (e.which == 35) {
                    jexcel.current.last(e.shiftKey, e.ctrlKey);
                    e.preventDefault();
                } else if (e.which == 32) {
                    if (jexcel.current.options.editable == true) {
                        jexcel.current.setCheckRadioValue();
                    }
                    e.preventDefault();
                } else if (e.which == 46) {
                    // Delete
                    if (jexcel.current.options.editable == true) {
                        if (jexcel.current.selectedRow) {
                            if (jexcel.current.options.allowDeleteRow == true) {
                                if (confirm(jexcel.current.options.text.areYouSureToDeleteTheSelectedRows)) {
                                    jexcel.current.deleteRow();
                                }
                            }
                        } else if (jexcel.current.selectedHeader) {
                            if (jexcel.current.options.allowDeleteColumn == true) {
                                if (confirm(jexcel.current.options.text.areYouSureToDeleteTheSelectedColumns)) {
                                    jexcel.current.deleteColumn();
                                }
                            }
                        } else {
                            // Change value
                            jexcel.current.setValue(jexcel.current.highlighted, '');
                        }
                    }
                } else if (e.which == 13) {
                    // Move cursor
                    if (e.shiftKey) {
                        jexcel.current.up();
                    } else {
                        if (jexcel.current.options.allowInsertRow == true) {
                            if (jexcel.current.options.allowManualInsertRow == true) {
                                if (jexcel.current.selectedCell[1] == jexcel.current.options.data.length - 1) {
                                    // New record in case selectedCell in the last row
                                    jexcel.current.insertRow();
                                }
                            }
                        }

                        jexcel.current.down();
                    }
                    e.preventDefault();
                } else if (e.which == 9) {
                    // Tab
                    if (e.shiftKey) {
                        jexcel.current.left();
                    } else {
                        if (jexcel.current.options.allowInsertColumn == true) {
                            if (jexcel.current.options.allowManualInsertColumn == true) {
                                if (jexcel.current.selectedCell[0] == jexcel.current.options.data[0].length - 1) {
                                    // New record in case selectedCell in the last column
                                    jexcel.current.insertColumn();
                                }
                            }
                        }

                        jexcel.current.right();
                    }
                    e.preventDefault();
                } else {
                    if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
                        if (e.which == 65) {
                            // Ctrl + A
                            jexcel.current.selectAll();
                            e.preventDefault();
                        } else if (e.which == 83) {
                            // Ctrl + S
                            jexcel.current.download();
                            e.preventDefault();
                        } else if (e.which == 89) {
                            // Ctrl + Y
                            jexcel.current.redo();
                            e.preventDefault();
                        } else if (e.which == 90) {
                            // Ctrl + Z
                            jexcel.current.undo();
                            e.preventDefault();
                        } else if (e.which == 67) {
                            // Ctrl + C
                            jexcel.current.copy(true);
                            e.preventDefault();
                        } else if (e.which == 88) {
                            // Ctrl + X
                            if (jexcel.current.options.editable == true) {
                                jexcel.cutControls();
                            } else {
                                jexcel.copyControls();
                            }
                            e.preventDefault();
                        } else if (e.which == 86) {
                            // Ctrl + V
                            jexcel.pasteControls();
                        }
                    } else {
                        if (jexcel.current.selectedCell) {
                            if (jexcel.current.options.editable == true) {
                                var rowId = jexcel.current.selectedCell[1];
                                var columnId = jexcel.current.selectedCell[0];

                                // If is not readonly
                                if (jexcel.current.options.columns[columnId].type != 'readonly') {
                                    // Characters able to start a edition
                                    if (e.keyCode == 32) {
                                        // Space
                                        if (jexcel.current.options.columns[columnId].type == 'checkbox' ||
                                            jexcel.current.options.columns[columnId].type == 'radio') {
                                            e.preventDefault();
                                        } else {
                                            // Start edition
                                            jexcel.current.openEditor(jexcel.current.records[rowId][columnId], true);
                                        }
                                    } else if (e.keyCode == 113) {
                                        // Start edition with current content F2
                                        jexcel.current.openEditor(jexcel.current.records[rowId][columnId], false);
                                    } else if ((e.keyCode == 8) ||
                                        (e.keyCode >= 48 && e.keyCode <= 57) ||
                                        (e.keyCode >= 96 && e.keyCode <= 111) ||
                                        (e.keyCode >= 187 && e.keyCode <= 190) ||
                                        ((String.fromCharCode(e.keyCode) == e.key || String.fromCharCode(e.keyCode).toLowerCase() == e.key.toLowerCase()) && jexcel.validLetter(String.fromCharCode(e.keyCode)))) {
                                        // Start edition
                                        jexcel.current.openEditor(jexcel.current.records[rowId][columnId], true);
                                        // Prevent entries in the calendar
                                        if (jexcel.current.options.columns[columnId].type == 'calendar') {
                                            e.preventDefault();
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                if (e.target.classList.contains('jexcel_search')) {
                    if (jexcel.timeControl) {
                        clearTimeout(jexcel.timeControl);
                    }

                    jexcel.timeControl = setTimeout(function () {
                        jexcel.current.search(e.target.value);
                    }, 200);
                }
            }
        }
    }

    jexcel.isMouseAction = false;

    jexcel.mouseDownControls = function (e) {
        e = e || window.event;
        if (e.buttons) {
            var mouseButton = e.buttons;
        } else if (e.button) {
            var mouseButton = e.button;
        } else {
            var mouseButton = e.which;
        }

        // Get elements
        var jexcelTable = jexcel.getElement(e.target);

        if (jexcelTable[0]) {
            if (jexcel.current !== jexcelTable[0].jexcel) {
                if (jexcel.current) {
                    if (jexcel.current.edition) {
                        jexcel.current.closeEditor(jexcel.current.edition[0], true);
                    }
                    jexcel.current.resetSelection();
                }
                jexcel.current = jexcelTable[0].jexcel;
            }
        } else {
            if (jexcel.current) {
                if (jexcel.current.edition) {
                    jexcel.current.closeEditor(jexcel.current.edition[0], true);
                }

                jexcel.current.resetSelection(true);
                jexcel.current = null;
            }
        }

        if (jexcel.current && mouseButton == 1) {
            if (e.target.classList.contains('jexcel_selectall')) {
                if (jexcel.current) {
                    jexcel.current.selectAll();
                }
            } else if (e.target.classList.contains('jexcel_corner')) {
                if (jexcel.current.options.editable == true) {
                    jexcel.current.selectedCorner = true;
                }
            } else {
                // Header found
                if (jexcelTable[1] == 1) {
                    var columnId = e.target.getAttribute('data-x');
                    if (columnId) {
                        // Update cursor
                        var info = e.target.getBoundingClientRect();
                        if (jexcel.current.options.columnResize == true && info.width - e.offsetX < 6) {
                            // Resize helper
                            jexcel.current.resizing = {
                                mousePosition: e.pageX,
                                column: columnId,
                                width: info.width,
                            };

                            // Border indication
                            jexcel.current.headers[columnId].classList.add('resizing');
                            for (var j = 0; j < jexcel.current.records.length; j++) {
                                if (jexcel.current.records[j][columnId]) {
                                    jexcel.current.records[j][columnId].classList.add('resizing');
                                }
                            }
                        } else if (jexcel.current.options.columnDrag == true && info.height - e.offsetY < 6) {
                            if (jexcel.current.isColMerged(columnId).length) {
                                console.error('Jspreadsheet: This column is part of a merged cell.');
                            } else {
                                // Reset selection
                                jexcel.current.resetSelection();
                                // Drag helper
                                jexcel.current.dragging = {
                                    element: e.target,
                                    column: columnId,
                                    destination: columnId,
                                };
                                // Border indication
                                jexcel.current.headers[columnId].classList.add('dragging');
                                for (var j = 0; j < jexcel.current.records.length; j++) {
                                    if (jexcel.current.records[j][columnId]) {
                                        jexcel.current.records[j][columnId].classList.add('dragging');
                                    }
                                }
                            }
                        } else {
                            if (jexcel.current.selectedHeader && (e.shiftKey || e.ctrlKey)) {
                                var o = jexcel.current.selectedHeader;
                                var d = columnId;
                            } else {
                                // Press to rename
                                if (jexcel.current.selectedHeader == columnId && jexcel.current.options.allowRenameColumn == true) {
                                    jexcel.timeControl = setTimeout(function () {
                                        jexcel.current.setHeader(columnId);
                                    }, 800);
                                }

                                // Keep track of which header was selected first
                                jexcel.current.selectedHeader = columnId;

                                // Update selection single column
                                var o = columnId;
                                var d = columnId;
                            }

                            // Update selection
                            jexcel.current.updateSelectionFromCoords(o, 0, d, jexcel.current.options.data.length - 1);
                        }
                    } else {
                        if (e.target.parentNode.classList.contains('jexcel_nested')) {
                            if (e.target.getAttribute('data-column')) {
                                var column = e.target.getAttribute('data-column').split(',');
                                var c1 = parseInt(column[0]);
                                var c2 = parseInt(column[column.length - 1]);
                            } else {
                                var c1 = 0;
                                var c2 = jexcel.current.options.columns.length - 1;
                            }
                            jexcel.current.updateSelectionFromCoords(c1, 0, c2, jexcel.current.options.data.length - 1);
                        }
                    }
                } else {
                    jexcel.current.selectedHeader = false;
                }

                // Body found
                if (jexcelTable[1] == 2) {
                    var rowId = e.target.getAttribute('data-y');

                    if (e.target.classList.contains('jexcel_row')) {
                        var info = e.target.getBoundingClientRect();
                        if (jexcel.current.options.rowResize == true && info.height - e.offsetY < 6) {
                            // Resize helper
                            jexcel.current.resizing = {
                                element: e.target.parentNode,
                                mousePosition: e.pageY,
                                row: rowId,
                                height: info.height,
                            };
                            // Border indication
                            e.target.parentNode.classList.add('resizing');
                        } else if (jexcel.current.options.rowDrag == true && info.width - e.offsetX < 6) {
                            if (jexcel.current.isRowMerged(rowId).length) {
                                console.error('Jspreadsheet: This row is part of a merged cell');
                            } else if (jexcel.current.options.search == true && jexcel.current.results) {
                                console.error('Jspreadsheet: Please clear your search before perform this action');
                            } else {
                                // Reset selection
                                jexcel.current.resetSelection();
                                // Drag helper
                                jexcel.current.dragging = {
                                    element: e.target.parentNode,
                                    row: rowId,
                                    destination: rowId,
                                };
                                // Border indication
                                e.target.parentNode.classList.add('dragging');
                            }
                        } else {
                            if (jexcel.current.selectedRow && (e.shiftKey || e.ctrlKey)) {
                                var o = jexcel.current.selectedRow;
                                var d = rowId;
                            } else {
                                // Keep track of which header was selected first
                                jexcel.current.selectedRow = rowId;

                                // Update selection single column
                                var o = rowId;
                                var d = rowId;
                            }

                            // Update selection
                            jexcel.current.updateSelectionFromCoords(0, o, jexcel.current.options.data[0].length - 1, d);
                        }
                    } else {
                        // Jclose
                        if (e.target.classList.contains('jclose') && e.target.clientWidth - e.offsetX < 50 && e.offsetY < 50) {
                            jexcel.current.closeEditor(jexcel.current.edition[0], true);
                        } else {
                            var getCellCoords = function (element) {
                                var x = element.getAttribute('data-x');
                                var y = element.getAttribute('data-y');
                                if (x && y) {
                                    return [x, y];
                                } else {
                                    if (element.parentNode) {
                                        return getCellCoords(element.parentNode);
                                    }
                                }
                            };

                            var position = getCellCoords(e.target);
                            if (position) {

                                var columnId = position[0];
                                var rowId = position[1];
                                // Close edition
                                if (jexcel.current.edition) {
                                    if (jexcel.current.edition[2] != columnId || jexcel.current.edition[3] != rowId) {
                                        jexcel.current.closeEditor(jexcel.current.edition[0], true);
                                    }
                                }

                                if (!jexcel.current.edition) {
                                    // Update cell selection
                                    if (e.shiftKey) {
                                        jexcel.current.updateSelectionFromCoords(jexcel.current.selectedCell[0], jexcel.current.selectedCell[1], columnId, rowId);
                                    } else {
                                        jexcel.current.updateSelectionFromCoords(columnId, rowId);
                                    }
                                }

                                // No full row selected
                                jexcel.current.selectedHeader = null;
                                jexcel.current.selectedRow = null;
                            }
                        }
                    }
                } else {
                    jexcel.current.selectedRow = false;
                }

                // Pagination
                if (e.target.classList.contains('jexcel_page')) {
                    if (e.target.innerText == '<') {
                        jexcel.current.page(0);
                    } else if (e.target.innerText == '>') {
                        jexcel.current.page(e.target.getAttribute('title') - 1);
                    } else {
                        jexcel.current.page(e.target.innerText - 1);
                    }
                }
            }

            if (jexcel.current.edition) {
                jexcel.isMouseAction = false;
            } else {
                jexcel.isMouseAction = true;
            }
        } else {
            jexcel.isMouseAction = false;
        }
    }

    jexcel.mouseUpControls = function (e) {
        if (jexcel.current) {
            // Update cell size
            if (jexcel.current.resizing) {
                // Columns to be updated
                if (jexcel.current.resizing.column) {
                    // New width
                    var newWidth = jexcel.current.colgroup[jexcel.current.resizing.column].getAttribute('width');
                    // Columns
                    var columns = jexcel.current.getSelectedColumns();
                    if (columns.length > 1) {
                        var currentWidth = [];
                        for (var i = 0; i < columns.length; i++) {
                            currentWidth.push(parseInt(jexcel.current.colgroup[columns[i]].getAttribute('width')));
                        }
                        // Previous width
                        var index = columns.indexOf(parseInt(jexcel.current.resizing.column));
                        currentWidth[index] = jexcel.current.resizing.width;
                        jexcel.current.setWidth(columns, newWidth, currentWidth);
                    } else {
                        jexcel.current.setWidth(jexcel.current.resizing.column, newWidth, jexcel.current.resizing.width);
                    }
                    // Remove border
                    jexcel.current.headers[jexcel.current.resizing.column].classList.remove('resizing');
                    for (var j = 0; j < jexcel.current.records.length; j++) {
                        if (jexcel.current.records[j][jexcel.current.resizing.column]) {
                            jexcel.current.records[j][jexcel.current.resizing.column].classList.remove('resizing');
                        }
                    }
                } else {
                    // Remove Class
                    jexcel.current.rows[jexcel.current.resizing.row].children[0].classList.remove('resizing');
                    var newHeight = jexcel.current.rows[jexcel.current.resizing.row].getAttribute('height');
                    jexcel.current.setHeight(jexcel.current.resizing.row, newHeight, jexcel.current.resizing.height);
                    // Remove border
                    jexcel.current.resizing.element.classList.remove('resizing');
                }
                // Reset resizing helper
                jexcel.current.resizing = null;
            } else if (jexcel.current.dragging) {
                // Reset dragging helper
                if (jexcel.current.dragging) {
                    if (jexcel.current.dragging.column) {
                        // Target
                        var columnId = e.target.getAttribute('data-x');
                        // Remove move style
                        jexcel.current.headers[jexcel.current.dragging.column].classList.remove('dragging');
                        for (var j = 0; j < jexcel.current.rows.length; j++) {
                            if (jexcel.current.records[j][jexcel.current.dragging.column]) {
                                jexcel.current.records[j][jexcel.current.dragging.column].classList.remove('dragging');
                            }
                        }
                        for (var i = 0; i < jexcel.current.headers.length; i++) {
                            jexcel.current.headers[i].classList.remove('dragging-left');
                            jexcel.current.headers[i].classList.remove('dragging-right');
                        }
                        // Update position
                        if (columnId) {
                            if (jexcel.current.dragging.column != jexcel.current.dragging.destination) {
                                jexcel.current.moveColumn(jexcel.current.dragging.column, jexcel.current.dragging.destination);
                            }
                        }
                    } else {
                        if (jexcel.current.dragging.element.nextSibling) {
                            var position = parseInt(jexcel.current.dragging.element.nextSibling.getAttribute('data-y'));
                            if (jexcel.current.dragging.row < position) {
                                position -= 1;
                            }
                        } else {
                            var position = parseInt(jexcel.current.dragging.element.previousSibling.getAttribute('data-y'));
                        }
                        if (jexcel.current.dragging.row != jexcel.current.dragging.destination) {
                            jexcel.current.moveRow(jexcel.current.dragging.row, position, true);
                        }
                        jexcel.current.dragging.element.classList.remove('dragging');
                    }
                    jexcel.current.dragging = null;
                }
            } else {
                // Close any corner selection
                if (jexcel.current.selectedCorner) {
                    jexcel.current.selectedCorner = false;

                    // Data to be copied
                    if (jexcel.current.selection.length > 0) {
                        // Copy data
                        jexcel.current.copyData(jexcel.current.selection[0], jexcel.current.selection[jexcel.current.selection.length - 1]);

                        // Remove selection
                        jexcel.current.removeCopySelection();
                    }
                }
            }
        }

        // Clear any time control
        if (jexcel.timeControl) {
            clearTimeout(jexcel.timeControl);
            jexcel.timeControl = null;
        }

        // Mouse up
        jexcel.isMouseAction = false;
    }

// Mouse move controls
    jexcel.mouseMoveControls = function (e) {
        e = e || window.event;
        if (e.buttons) {
            var mouseButton = e.buttons;
        } else if (e.button) {
            var mouseButton = e.button;
        } else {
            var mouseButton = e.which;
        }

        if (!mouseButton) {
            jexcel.isMouseAction = false;
        }

        if (jexcel.current) {
            if (jexcel.isMouseAction == true) {
                // Resizing is ongoing
                if (jexcel.current.resizing) {
                    if (jexcel.current.resizing.column) {
                        var width = e.pageX - jexcel.current.resizing.mousePosition;

                        if (jexcel.current.resizing.width + width > 0) {
                            var tempWidth = jexcel.current.resizing.width + width;
                            jexcel.current.colgroup[jexcel.current.resizing.column].setAttribute('width', tempWidth);

                            jexcel.current.updateCornerPosition();
                        }
                    } else {
                        var height = e.pageY - jexcel.current.resizing.mousePosition;

                        if (jexcel.current.resizing.height + height > 0) {
                            var tempHeight = jexcel.current.resizing.height + height;
                            jexcel.current.rows[jexcel.current.resizing.row].setAttribute('height', tempHeight);

                            jexcel.current.updateCornerPosition();
                        }
                    }
                }
            } else {
                var x = e.target.getAttribute('data-x');
                var y = e.target.getAttribute('data-y');
                var rect = e.target.getBoundingClientRect();

                if (jexcel.current.cursor) {
                    jexcel.current.cursor.style.cursor = '';
                    jexcel.current.cursor = null;
                }

                if (e.target.parentNode.parentNode && e.target.parentNode.parentNode.className) {
                    if (e.target.parentNode.parentNode.classList.contains('resizable')) {
                        if (e.target && x && !y && (rect.width - (e.clientX - rect.left) < 6)) {
                            jexcel.current.cursor = e.target;
                            jexcel.current.cursor.style.cursor = 'col-resize';
                        } else if (e.target && !x && y && (rect.height - (e.clientY - rect.top) < 6)) {
                            jexcel.current.cursor = e.target;
                            jexcel.current.cursor.style.cursor = 'row-resize';
                        }
                    }

                    if (e.target.parentNode.parentNode.classList.contains('draggable')) {
                        if (e.target && !x && y && (rect.width - (e.clientX - rect.left) < 6)) {
                            jexcel.current.cursor = e.target;
                            jexcel.current.cursor.style.cursor = 'move';
                        } else if (e.target && x && !y && (rect.height - (e.clientY - rect.top) < 6)) {
                            jexcel.current.cursor = e.target;
                            jexcel.current.cursor.style.cursor = 'move';
                        }
                    }
                }
            }
        }
    }

    jexcel.mouseOverControls = function (e) {
        e = e || window.event;
        if (e.buttons) {
            var mouseButton = e.buttons;
        } else if (e.button) {
            var mouseButton = e.button;
        } else {
            var mouseButton = e.which;
        }

        if (!mouseButton) {
            jexcel.isMouseAction = false;
        }

        if (jexcel.current && jexcel.isMouseAction == true) {
            // Get elements
            var jexcelTable = jexcel.getElement(e.target);

            if (jexcelTable[0]) {
                // Avoid cross reference
                if (jexcel.current != jexcelTable[0].jexcel) {
                    if (jexcel.current) {
                        return false;
                    }
                }

                var columnId = e.target.getAttribute('data-x');
                var rowId = e.target.getAttribute('data-y');

                if (jexcel.current.dragging) {
                    if (jexcel.current.dragging.column) {
                        if (columnId) {
                            if (jexcel.current.isColMerged(columnId).length) {
                                console.error('Jspreadsheet: This column is part of a merged cell.');
                            } else {
                                for (var i = 0; i < jexcel.current.headers.length; i++) {
                                    jexcel.current.headers[i].classList.remove('dragging-left');
                                    jexcel.current.headers[i].classList.remove('dragging-right');
                                }

                                if (jexcel.current.dragging.column == columnId) {
                                    jexcel.current.dragging.destination = parseInt(columnId);
                                } else {
                                    if (e.target.clientWidth / 2 > e.offsetX) {
                                        if (jexcel.current.dragging.column < columnId) {
                                            jexcel.current.dragging.destination = parseInt(columnId) - 1;
                                        } else {
                                            jexcel.current.dragging.destination = parseInt(columnId);
                                        }
                                        jexcel.current.headers[columnId].classList.add('dragging-left');
                                    } else {
                                        if (jexcel.current.dragging.column < columnId) {
                                            jexcel.current.dragging.destination = parseInt(columnId);
                                        } else {
                                            jexcel.current.dragging.destination = parseInt(columnId) + 1;
                                        }
                                        jexcel.current.headers[columnId].classList.add('dragging-right');
                                    }
                                }
                            }
                        }
                    } else {
                        if (rowId) {
                            if (jexcel.current.isRowMerged(rowId).length) {
                                console.error('Jspreadsheet: This row is part of a merged cell.');
                            } else {
                                var target = (e.target.clientHeight / 2 > e.offsetY) ? e.target.parentNode.nextSibling : e.target.parentNode;
                                if (jexcel.current.dragging.element != target) {
                                    e.target.parentNode.parentNode.insertBefore(jexcel.current.dragging.element, target);
                                    jexcel.current.dragging.destination = Array.prototype.indexOf.call(jexcel.current.dragging.element.parentNode.children, jexcel.current.dragging.element);
                                }
                            }
                        }
                    }
                } else if (jexcel.current.resizing) {
                } else {
                    // Header found
                    if (jexcelTable[1] == 1) {
                        if (jexcel.current.selectedHeader) {
                            var columnId = e.target.getAttribute('data-x');
                            var o = jexcel.current.selectedHeader;
                            var d = columnId;
                            // Update selection
                            jexcel.current.updateSelectionFromCoords(o, 0, d, jexcel.current.options.data.length - 1);
                        }
                    }

                    // Body found
                    if (jexcelTable[1] == 2) {
                        if (e.target.classList.contains('jexcel_row')) {
                            if (jexcel.current.selectedRow) {
                                var o = jexcel.current.selectedRow;
                                var d = rowId;
                                // Update selection
                                jexcel.current.updateSelectionFromCoords(0, o, jexcel.current.options.data[0].length - 1, d);
                            }
                        } else {
                            // Do not select edtion is in progress
                            if (!jexcel.current.edition) {
                                if (columnId && rowId) {
                                    if (jexcel.current.selectedCorner) {
                                        jexcel.current.updateCopySelection(columnId, rowId);
                                    } else {
                                        if (jexcel.current.selectedCell) {
                                            jexcel.current.updateSelectionFromCoords(jexcel.current.selectedCell[0], jexcel.current.selectedCell[1], columnId, rowId);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Clear any time control
        if (jexcel.timeControl) {
            clearTimeout(jexcel.timeControl);
            jexcel.timeControl = null;
        }
    }

    /**
     * Double click event handler: controls the double click in the corner, cell edition or column re-ordering.
     */
    jexcel.doubleClickControls = function (e) {
        // Jexcel is selected
        if (jexcel.current) {
            // Corner action
            if (e.target.classList.contains('jexcel_corner')) {
                // Any selected cells
                if (jexcel.current.highlighted.length > 0) {
                    // Copy from this
                    var x1 = jexcel.current.highlighted[0].getAttribute('data-x');
                    var y1 = parseInt(jexcel.current.highlighted[jexcel.current.highlighted.length - 1].getAttribute('data-y')) + 1;
                    // Until this
                    var x2 = jexcel.current.highlighted[jexcel.current.highlighted.length - 1].getAttribute('data-x');
                    var y2 = jexcel.current.records.length - 1
                    // Execute copy
                    jexcel.current.copyData(jexcel.current.records[y1][x1], jexcel.current.records[y2][x2]);
                }
            } else if (e.target.classList.contains('jexcel_column_filter')) {
                // Column
                var columnId = e.target.getAttribute('data-x');
                // Open filter
                jexcel.current.openFilter(columnId);

            } else {
                // Get table
                var jexcelTable = jexcel.getElement(e.target);

                // Double click over header
                if (jexcelTable[1] == 1 && jexcel.current.options.columnSorting == true) {
                    // Check valid column header coords
                    var columnId = e.target.getAttribute('data-x');
                    if (columnId) {
                        jexcel.current.orderBy(columnId);
                    }
                }

                // Double click over body
                if (jexcelTable[1] == 2 && jexcel.current.options.editable == true) {
                    if (!jexcel.current.edition) {
                        var getCellCoords = function (element) {
                            if (element.parentNode) {
                                var x = element.getAttribute('data-x');
                                var y = element.getAttribute('data-y');
                                if (x && y) {
                                    return element;
                                } else {
                                    return getCellCoords(element.parentNode);
                                }
                            }
                        }
                        var cell = getCellCoords(e.target);
                        if (cell && cell.classList.contains('highlight')) {
                            jexcel.current.openEditor(cell);
                        }
                    }
                }
            }
        }
    }

    jexcel.copyControls = function (e) {
        if (jexcel.current && jexcel.copyControls.enabled) {
            if (!jexcel.current.edition) {
                jexcel.current.copy(true);
            }
        }
    }

    jexcel.cutControls = function (e) {
        if (jexcel.current) {
            if (!jexcel.current.edition) {
                jexcel.current.copy(true);
                if (jexcel.current.options.editable == true) {
                    jexcel.current.setValue(jexcel.current.highlighted, '');
                }
            }
        }
    }

    jexcel.pasteControls = function (e) {
        if (jexcel.current && jexcel.current.selectedCell) {
            if (!jexcel.current.edition) {
                if (jexcel.current.options.editable == true) {
                    if (e && e.clipboardData) {
                        jexcel.current.paste(jexcel.current.selectedCell[0], jexcel.current.selectedCell[1], e.clipboardData.getData('text'));
                        e.preventDefault();
                    } else if (window.clipboardData) {
                        jexcel.current.paste(jexcel.current.selectedCell[0], jexcel.current.selectedCell[1], window.clipboardData.getData('text'));
                    }
                }
            }
        }
    }

    jexcel.contextMenuControls = function (e) {
        e = e || window.event;
        if ("buttons" in e) {
            var mouseButton = e.buttons;
        } else {
            var mouseButton = e.which || e.button;
        }

        if (jexcel.current) {
            if (jexcel.current.edition) {
                e.preventDefault();
            } else if (jexcel.current.options.contextMenu) {
                jexcel.current.contextMenu.contextmenu.close();

                if (jexcel.current) {
                    var x = e.target.getAttribute('data-x');
                    var y = e.target.getAttribute('data-y');

                    if (x || y) {
                        if ((x < parseInt(jexcel.current.selectedCell[0])) || (x > parseInt(jexcel.current.selectedCell[2])) ||
                            (y < parseInt(jexcel.current.selectedCell[1])) || (y > parseInt(jexcel.current.selectedCell[3]))) {
                            jexcel.current.updateSelectionFromCoords(x, y, x, y);
                        }

                        // Table found
                        var items = jexcel.current.options.contextMenu(jexcel.current, x, y, e);
                        // The id is depending on header and body
                        jexcel.current.contextMenu.contextmenu.open(e, items);
                        // Avoid the real one
                        e.preventDefault();
                    }
                }
            }
        }
    }

    jexcel.touchStartControls = function (e) {
        var jexcelTable = jexcel.getElement(e.target);

        if (jexcelTable[0]) {
            if (jexcel.current != jexcelTable[0].jexcel) {
                if (jexcel.current) {
                    jexcel.current.resetSelection();
                }
                jexcel.current = jexcelTable[0].jexcel;
            }
        } else {
            if (jexcel.current) {
                jexcel.current.resetSelection();
                jexcel.current = null;
            }
        }

        if (jexcel.current) {
            if (!jexcel.current.edition) {
                var columnId = e.target.getAttribute('data-x');
                var rowId = e.target.getAttribute('data-y');

                if (columnId && rowId) {
                    jexcel.current.updateSelectionFromCoords(columnId, rowId);

                    jexcel.timeControl = setTimeout(function () {
                        // Keep temporary reference to the element
                        if (jexcel.current.options.columns[columnId].type == 'color') {
                            jexcel.tmpElement = null;
                        } else {
                            jexcel.tmpElement = e.target;
                        }
                        jexcel.current.openEditor(e.target, false, e);
                    }, 500);
                }
            }
        }
    }

    jexcel.touchEndControls = function (e) {
        // Clear any time control
        if (jexcel.timeControl) {
            clearTimeout(jexcel.timeControl);
            jexcel.timeControl = null;
            // Element
            if (jexcel.tmpElement && jexcel.tmpElement.children[0].tagName == 'INPUT') {
                jexcel.tmpElement.children[0].focus();
            }
            jexcel.tmpElement = null;
        }
    }
}


