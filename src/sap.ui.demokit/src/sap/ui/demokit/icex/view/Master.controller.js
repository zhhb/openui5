/*!
 * ${copyright}
 */

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/ui/demokit/icex/model/Config",
	"sap/ui/Device"], function (Controller, Filter, FilterOperator, JSONModel, Config, Device) {
	"use strict";

	return Controller.extend("sap.ui.demokit.icex.view.Master", {

		onInit : function () {

			// set ui model
			var oModel = new JSONModel({
				listMode : (Device.system.phone) ? "None" : "SingleSelectMaster",
				listItemType : (Device.system.phone) ? "Active" : "Inactive",
				listPageSize : Config.getPageSize(),
				showFooter : !Device.system.phone
			});
			this.getView().setModel(oModel, "ui");

			// do first search to set visibilities of lists
			this.search();
		},

		search : function () {

			var searchValue = this.getView().byId("search").getValue();
			var showSearch = (searchValue.length !== 0);

			// switch visibility of lists
			var iconList = this.getView().byId("iconList");
			var groupList = this.getView().byId("groupList");
			iconList.toggleStyleClass("invisible", !showSearch);
			groupList.toggleStyleClass("invisible", showSearch);

			// filter icon list
			var binding = iconList.getBinding("items");
			if (showSearch && binding !== undefined) {
				var filterName = new Filter("name", FilterOperator.Contains, searchValue);
				binding.filter([filterName]);
			}
		},

		toFavorite : function (evt) {
			var bus = this.getOwnerComponent().getEventBus();
			bus.publish("nav", "to", {
				id : "Favorite"
			});
		},

		selectIconList : function (evt) {
			this._showDetail(evt.getParameter("listItem"));
		},

		pressIconListItem : function (evt) {
			this._showDetail(evt.getSource());
		},

		_showDetail : function (item) {

			// tell app controller to navigate
			var bus = this.getOwnerComponent().getEventBus();
			bus.publish("nav", "to", {
				id : "Detail"
			});

			// tell detail to update
			bus.publish("app", "RefreshDetail", {
				name : item.getBindingContext().getObject().name
			});
		},

		pressGroupListItem : function (evt) {
			var bus = this.getOwnerComponent().getEventBus();
			bus.publish("nav", "to", {
				id : "Group",
				data : {
					context : evt.getSource().getBindingContext()
				}
			});
		}
	});
});
