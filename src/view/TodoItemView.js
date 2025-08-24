import { element } from "./html-util.js";

export class TodoItemView {
  /**
   * `todoItem`に対応するTodoアイテムのHTML要素を作成して返す
   * @param {TodoItemModel} todoItem
   * @param {function({id:number, completed: boolean})} onUpdateTodo チェックボックスの更新イベントリスナー
   * @param {function({id:number})} onDeleteTodo 削除ボタンのクリックイベントリスナー
   * @returns {Element}
   */
  createElement(todoItem, { onUpdateTodo, onDeleteTodo }) {
    // Todoが完了していればチェック済み、していなければ未チェックのTodoアイテムをひとつ作成
    const todoItemElement = todoItem.completed
      ? element`<li><input type="checkbox" class="checkbox" checked>
                                    <s>${todoItem.title}</s>
                                    <button class="edit">編集</button>
                                    <button class="delete">削除</button>
                                </li>`
      : element`<li><input type="checkbox" class="checkbox">
                                    ${todoItem.title}
                                    <button class="edit">編集</button>
                                    <button class="delete">削除</button>
                                </li>`;

    // querySelector(".クラス名")でそのクラス名を持つ要素を取得する（今回は上で作成したチェックボックス(input要素)）
    const inputCheckboxElement = todoItemElement.querySelector(".checkbox");
    // 「addEventListener("change", ...)」で、コントロールの値が変化した後に発火する
    inputCheckboxElement.addEventListener("change", () => {
      onUpdateTodo({
        id: todoItem.id,
        completed: !todoItem.completed  // 現在の完了フラグと逆にする
      });
    });

    const deleteButtonElement = todoItemElement.querySelector(".delete");
    // 「addEventListener("click", ...)」で、ボタンをクリックしたときに発火する
    deleteButtonElement.addEventListener("click", () => {
      onDeleteTodo({
        id: todoItem.id
      });
    });
    // 作成したTodoアイテムのHTML要素を返す
    return todoItemElement;
  }
}
