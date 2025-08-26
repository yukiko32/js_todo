import { element } from "./html-util.js";

export class TodoItemView {
  /**
   * `todoItem`に対応するTodoアイテムのHTML要素を作成して返す
   * @param {TodoItemModel} todoItem
   * @param {function({id:number, completed: boolean})} onUpdateTodo チェックボックスの更新イベントリスナー
   * @param {function({id:number})} onDeleteTodo 削除ボタンのクリックイベントリスナー
   * @returns {Element}
   */
  createElement(todoItem, { onUpdateTodo, onDeleteTodo, onEditTodo, onStartEdit }, editingId) {
    // 状態により編集中・完了済み・未完了のTodoアイテムを作成
    let todoItemElement = null;
    if (todoItem.id === editingId) {
      todoItemElement = element`<li class="row gap-2 mb-2">
                                    <input type = "text" value="${todoItem.title}" class="edit col fs-5 form-control">
                                    <button class="save-btn col-2 btn btn-primary">保存</button>
                                </li>`;
    } else if (todoItem.completed) {
      todoItemElement = element`<li class="row gap-2 mb-2"><input type="checkbox" class="checkbox col-1" checked>
                                    <span class="title col fs-5"><s>${todoItem.title}</s></span>
                                    <button class="edit-btn col-2 btn btn-primary">編集</button>
                                    <button class="delete-btn col-2 btn btn-primary">削除</button>
                                </li>`;
    } else {
      todoItemElement = element`<li class="row gap-2 mb-2"><input type="checkbox" class="checkbox col-1">
                                    <span class="title col fs-5">${todoItem.title}</span>
                                    <button class="edit-btn col-2 btn btn-primary">編集</button>
                                    <button class="delete-btn col-2 btn btn-primary">削除</button>
                                </li>`;
    }

    // Todoアイテムの完了フラグの変更
    // querySelector(".クラス名")でそのクラス名を持つ要素を取得する（今回は上で作成したチェックボックス(input要素)）
    const inputCheckboxElement = todoItemElement.querySelector(".checkbox");
    // 「addEventListener("change", ...)」で、コントロールの値が変化した後に発火する
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

    // Todoアイテムのタイトルを編集
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
        onEditTodo({
          id: todoItem.id,
          title: newTitle
        });
      });
    }

    // 作成したTodoアイテムのHTML要素を返す
    return todoItemElement;
  }
}
