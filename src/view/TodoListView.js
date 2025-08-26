import { element } from "./html-util.js";
import { TodoItemView } from "./TodoItemView.js";

export class TodoListView {
  /**
   * `todoItems`に対応するTodoリストのHTML要素を作成して返す
   * @param {TodoItemModel[]} todoItems TodoItemModelの配列
   * @param {function({id:number, completed: boolean})} onUpdateTodo チェックボックスの更新イベントリスナー
   * @param {function({id:number})} onDeleteTodo 削除ボタンのクリックイベントリスナー
   * @returns {Element} TodoItemModelの配列に対応したリストのHTML要素
   */
  createElement(todoItems, { onUpdateTodo, onDeleteTodo, onEditTodo, onStartEdit }, editingId) {
    // todoListElement(大枠)のDOM Nodeを作成する
    const todoListElement = element`<ul class="list-unstyled"></ul>`;
    // 各TodoItemモデルに対応したHTML要素を作成し、リスト要素へ追加する
    todoItems.forEach(todoItem => {
      const todoItemView = new TodoItemView();
      const todoItemElement = todoItemView.createElement(todoItem, {
        onUpdateTodo,
        onDeleteTodo,
        onEditTodo,
        onStartEdit
      }, editingId);
      todoListElement.appendChild(todoItemElement);  // todoListElement(大枠)にtodoItemElement(アイテム)を追加していく
    });
    return todoListElement;  // todoListElement(大枠)を返す
  }
}
