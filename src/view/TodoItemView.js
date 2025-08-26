import { element } from "./html-util.js";

export class TodoItemView {
  /**
   * `todoItem`に対応するTodoアイテムのHTML要素を作成して返す
   * @param {TodoItemModel} todoItem
   * @param {function({id:number, completed: boolean})} onUpdateTodo チェックボックスの更新イベントリスナー
   * @param {function({id:number})} onDeleteTodo 削除ボタンのクリックイベントリスナー
   * @param {function({id:number})} onStartEdit 編集ボタンのクリックイベントリスナー
   * @param {function({id:number, title: string})} onUpdateTitle 保存ボタンの更新イベントリスナー
   * @param {number} editingId 編集中のTodoItemのid
   * @returns {Element}
   */
  createElement(todoItem, { onUpdateTodo, onDeleteTodo, onStartEdit, onUpdateTitle }, editingId) {
    // 状態により編集中・完了済み・未完了のTodoアイテムを作成
    let todoItemElement = null;
    if (todoItem.id === editingId) {
      todoItemElement = element`<li class="row gap-2 py-1 mb-2 alert alert-light align-items-center">
                                    <input type = "text" value="${todoItem.title}" class="edit col form-control form-control-sm">
                                    <button class="save-btn col-2 btn btn-danger btn-sm">保存</button>
                                </li>`;
    } else if (todoItem.completed) {
      todoItemElement = element`<li class="row gap-2 py-1 mb-2 alert alert-secondary align-items-center">
                                    <input type="checkbox" class="checkbox col-1" checked>
                                    <span class="title col"><s>${todoItem.title}</s></span>
                                    <button class="edit-btn col-1 btn btn-dark opacity-75 btn-sm">編集</button>
                                    <button class="delete-btn col-1 btn btn-dark btn-sm">削除</button>
                                </li>`;
    } else {
      todoItemElement = element`<li class="row gap-2 py-1 mb-2 alert alert-light align-items-center">
                                    <input type="checkbox" class="checkbox col-1">
                                    <span class="title col">${todoItem.title}</span>
                                    <button class="edit-btn col-1 btn btn-dark opacity-75 btn-sm">編集</button>
                                    <button class="delete-btn col-1 btn btn-dark btn-sm">削除</button>
                                </li>`;
    }

    // Todoアイテムの完了フラグの変更
    const inputCheckboxElement = todoItemElement.querySelector(".checkbox");
    if (inputCheckboxElement) {
      inputCheckboxElement.addEventListener("change", () => {
        onUpdateTodo({
          id: todoItem.id,
          completed: !todoItem.completed  // 現在の完了フラグと逆にする
        });
      });
    }

    // Todoアイテムの削除
    const deleteButtonElement = todoItemElement.querySelector(".delete-btn");
    if (deleteButtonElement) {
      deleteButtonElement.addEventListener("click", () => {
        if (window.confirm("本当に削除してもよろしいですか？")) {
          onDeleteTodo({
            id: todoItem.id
          });
        }
      });
    }

    // Todoアイテムのタイトルを編集中にする
    const editButtonElement = todoItemElement.querySelector(".edit-btn");
    if (editButtonElement) {
      editButtonElement.addEventListener("click", () => {
        onStartEdit({
          id: todoItem.id
        });
      });
    }

    // Todoアイテムのタイトルを保存
    const saveButtonElement = todoItemElement.querySelector(".save-btn");
    if (saveButtonElement) {
      saveButtonElement.addEventListener("click", () => {
        const editElement = todoItemElement.querySelector(".edit");
        const newTitle = editElement.value;
        onUpdateTitle({
          id: todoItem.id,
          title: newTitle
        });
      });
    }

    // 作成したTodoアイテムのHTML要素を返す
    return todoItemElement;
  }
}
