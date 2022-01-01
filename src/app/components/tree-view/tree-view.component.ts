import { Component } from '@angular/core';
import { NodeModel } from 'src/app/models/node.model';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss'],
})
export class TreeViewComponent {
  fileFolderStructureList: NodeModel[] = [];
  fileFolderName = '';
  isAddingRoot = false;
  isAddingChild = false;
  showChildSection = false;
  showFileFolderSelection = false;
  currentSelectedNode;
  itemId = '';
  selectedNodeType = '';

  constructor() { }

  // show root section to add node at root level
  showRootForm() {
    this.isAddingRoot = true;
    setTimeout(() => {
      if (document.getElementById('rootNameTxt')) {
        document.getElementById('rootNameTxt').focus();
      }
    }, 50);
  }

  // hide the open section for root/child
  onRemove(type: string) {
    this.fileFolderName = '';
    type === 'root' ? this.isAddingRoot = false : this.isAddingChild = false;
  }

  // function that add file and folder using recursion at selected node
  addFileFolder(arr, keyVal, nodeItem) {
    for (const [index, elem] of arr.entries()) {
      if (elem['id'] === keyVal) {
        arr[index].children.push(nodeItem);
      } else {
        this.addFileFolder(elem.children, keyVal, nodeItem);
      }
    }
    return arr;
  };

  // function that remove file and folder using recursion
  removeFileFolder(arr, keyVal) {
    for (const [index, elem] of arr.entries()) {
      if (elem['id'] === keyVal) {
        arr.splice(index, 1);
      } else {
        this.removeFileFolder(elem.children, keyVal);
      }
    }
    return arr;
  };

  // show or hide add/delete button for specific item
  showAddRemoveOption(item, isShow: boolean) {
    this.itemId = isShow ? item.id : '';
  }

  // show child section for selected node
  showChildForm(item) {
    this.currentSelectedNode = JSON.stringify(item);
    this.showFileFolderSelection = true;
    setTimeout(() => {
      if (document.getElementById(`childNameTxt${item.id}`)) {
        document.getElementById(`childNameTxt${item.id}`).focus();
      }
    }, 50);
  }

  // delete item from list
  deleteINode(item) {
    this.showFileFolderSelection = false;
    this.fileFolderStructureList = this.removeFileFolder(this.fileFolderStructureList, item.id);
  }

  // set node type
  setNodeType(event) {
    this.selectedNodeType = event.target.value;
    this.showChildSection = true;
  }

  // add file/folder to list
  addNode(isRoot: boolean) {
    if (isRoot) {
      if (!this.fileFolderName && this.fileFolderName === '') {
        return;
      }
      // if it's root then we directly add to the list at root level no need to check any other things
      this.fileFolderStructureList.push({
        name: this.fileFolderName,
        children: [],
        id: (Math.random() + 1).toString(36).substring(2),
        type: 'folder',
      });
      this.isAddingRoot = false;
      this.fileFolderName = '';
    } else {
      if (!this.fileFolderName && this.fileFolderName === '') {
        return;
      }

      // need to use recursion because it's child node
      this.fileFolderStructureList = this.addFileFolder(
        this.fileFolderStructureList,
        JSON.parse(this.currentSelectedNode).id,
        {
          name: this.fileFolderName,
          children: [],
          id: (Math.random() + 1).toString(36).substring(2),
          type: this.selectedNodeType,
        }
      );
      this.isAddingChild = false;
      this.showChildSection = false;
      this.fileFolderName = '';
      this.currentSelectedNode = undefined;
    }
    this.itemId = '';
    this.showFileFolderSelection = false;
  }
}
