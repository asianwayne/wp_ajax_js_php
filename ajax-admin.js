(function( $ ) {
	'use strict';


	class SendAjax {
		//constructor for properties
		constructor(title,author) {
			this.title = title;
			this.author = author;

			this.ajaxurl = hr_system.ajaxurl;
			this.departmentform = $("#departmentform");
			this.departmentdelete = $(".btn-delete-department");

			this.alert = $(".alert");
			this.events();
		}

		events() {
			this.departmentform.on('submit',this.createDepartment.bind(this));
			$("#department-list").on('click',(e) => {
				this.deleteItem(e.target);
			});

		}

		//methods 
		
		createDepartment(e) {

			e.preventDefault();
			let postdata = $("#departmentform").serialize();
			postdata += "&action=hr_system_admin_request&param=create_department";
			
			$.post(this.ajaxurl,postdata,(response) => {
				
				let data = $.parseJSON(response);

				if (data.status == 1) {
					this.showAlert(data,'success');
					$("#departmentform").find('input,textarea').val('');

					setTimeout(() => {
						location.reload();
					},1000);
				} else {
					this.showAlert(data,'danger');

				}
			});}

		showAlert(data,className) {
			this.alert.removeClass("d-none");
			this.alert.addClass(` alert-${className}`);
			this.alert.text(data.message);

			setTimeout(() => {
				this.alert.addClass("d-none");
			},3000);

		}

		deleteItem(el) {
			//如果只是 delete 按键的 click 动作 永远只会响应第一个 
			//make sure what we click contains the class delete whici is set by the html 
			let department_row_id = $(el).attr('data-id');
			let postdata = "action=hr_system_admin_request&param=delete_department&department_id="+department_row_id;

			$.post(this.ajaxurl,postdata,(response) => {
				let data = $.parseJSON(response);

				if (data.status == 1) {
					if ($(el).hasClass('delete')) {
						$(el).parent().parent().slideUp();
					}
					this.showAlert(data,'success');
				}
			});
			
		}

	}
	jQuery(document).ready(() => {
		$("#department_list_table").DataTable();
		new SendAjax;
		});

	/**
	 * All of the code for your admin-facing JavaScript source
	 * should reside in this file.
	 *
	 * Note: It has been assumed you will write jQuery code here, so the
	 * $ function reference has been prepared for usage within the scope
	 * of this function.
	 *
	 * This enables you to define handlers, for when the DOM is ready:
	 *
	 * $(function() {
	 *
	 * });
	 *
	 * When the window is loaded:
	 *
	 * $( window ).load(function() {
	 *
	 * });
	 *
	 * ...and/or other possibilities.
	 *
	 * Ideally, it is not considered best practise to attach more than a
	 * single DOM-ready or window-load handler for a particular page.
	 * Although scripts in the WordPress core, Plugins and Themes may be
	 * practising this, we should strive to set a better example in our own work.
	 */
})( jQuery );
