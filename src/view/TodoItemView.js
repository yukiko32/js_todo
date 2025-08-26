import { element } from "./html-util.js";

export class TodoItemView {
  /**
   * `todoItem`に対応するTodoアイテムのHTML要素を作成して返す
   * @param {TodoItemModel} todoItem
   * @param {function({id:number, completed: boolean})} onUpdateTodo チェックボックスの更新イベントリスナー
   * @param {function({id:number})} onDeleteTodo 削除ボタンのクリックイベントリスナー
   * @returns {Element}
   */
  createElement(todoItem, { onUpdateTodo, onDeleteTodo, onEditTodo }) {
    // Todoが完了していればチェック済み、していなければ未チェックのTodoアイテムを作成
    const todoItemElement = todoItem.completed
      ? element`<li class="row gap-2 mb-2"><input type="checkbox" class="checkbox col-1" checked>
                                    <span class="title col fs-5"><s>${todoItem.title}</s></span>
                                    <button class="edit col-2 btn btn-primary">編集</button>
                                    <button class="delete col-2 btn btn-primary">削除</button>
                                </li>`
      : element`<li class="row gap-2 mb-2"><input type="checkbox" class="checkbox col-1">
                                    <span class="title col fs-5">${todoItem.title}</span>
                                    <button class="edit col-2 btn btn-primary">編集</button>
                                    <button class="delete col-2 btn btn-primary">削除</button>
                                </li>`;

    // Todoアイテムの完了フラグの変更
    // querySelector(".クラス名")でそのクラス名を持つ要素を取得する（今回は上で作成したチェックボックス(input要素)）
    const inputCheckboxElement = todoItemElement.querySelector(".checkbox");
    // 「addEventListener("change", ...)」で、コントロールの値が変化した後に発火する
    inputCheckboxElement.addEventListener("change", () => {
      onUpdateTodo({
        id: todoItem.id,
        completed: !todoItem.completed  // 現在の完了フラグと逆にする
      });
    });

    // Todoアイテムの削除
    const deleteButtonElement = todoItemElement.querySelector(".delete");
    deleteButtonElement.addEventListener("click", () => {
      if (window.confirm("本当に削除してもよろしいですか？")) {
        onDeleteTodo({
          id: todoItem.id
        });
      }
    });

    // Todoアイテムのタイトルを編集
    const editButtonElement = todoItemElement.querySelector(".edit");
    editButtonElement.addEventListener("click", () => {

      

      // 現在のタイトルを取得
      const oldTitle = todoItem.title;

      // Elementを取得
      const titleElement = todoItemElement.querySelector(".title");
      const deleteButtonElement = todoItemElement.querySelector(".delete");

      // inputElementを作成
      const inputElement = document.createElement("input");
      inputElement.type = "text";
      inputElement.value = oldTitle;
      inputElement.className = "col";
      inputElement.classList.add("form-control", "fs-5");

      // 保存ボタンを作成
      const saveButtonElement = document.createElement("button");
      saveButtonElement.textContent = "保存";
      saveButtonElement.className = "btn btn-primary";
      saveButtonElement.classList.add("col-2");

      // 各Elementを置き換える
      todoItemElement.replaceChild(inputElement, titleElement);
      todoItemElement.replaceChild(saveButtonElement, editButtonElement);
      inputCheckboxElement.style.display = "none";
      deleteButtonElement.style.display = "none";

      // 保存ボタンが押されたらTodoタイトルを更新する
      saveButtonElement.addEventListener("click", () => {
        const newTitle = inputElement.value;
        onEditTodo({
          id: todoItem.id,
          title: newTitle
        });
      });


    });

    // 作成したTodoアイテムのHTML要素を返す
    return todoItemElement;
  }
}
