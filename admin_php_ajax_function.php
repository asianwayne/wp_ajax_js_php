//处理admin_ajax 的主要请求的函数

	public function hr_system_admin_ajax_callback() {
//必须要添加wp_die() 否则返回的请求会添加0 

		global $wpdb;
		$param = isset($_REQUEST['param']) ? $_REQUEST['param'] : '';

		if (!empty($param)) {
			if ($param == 'create_department') {
				$name = isset($_REQUEST['name']) ? sanitize_text_field( $_REQUEST['name'] ) : "";
				$director = isset($_REQUEST['director']) ? sanitize_text_field( $_REQUEST['director'] ) : "";
				$duty = isset($_REQUEST['duty']) ? sanitize_textarea_field( $_REQUEST['duty'] ) : "";
				$foundation = isset($_REQUEST['foundation']) ? $_REQUEST['foundation'] : "";

				$wpdb->insert($this->table_activator->department_table,array(
					'name' => $name,
					'director' => $director,
					'duty' => $duty,
					'foundation' => $foundation

				));

				if ($wpdb->insert_id > 0) {

					echo json_encode(array(
					'status' => 1,
					'message'  => "Successfully create the department"

				));
					
				} else {
					echo json_encode(array(
						'status' => 0,
						'message'  => "Failed to create book please try it again"
					));
				}} elseif($param == 'delete_department') {
					$department_id = isset($_REQUEST['department_id']) ? intval($_REQUEST['department_id']) : 0;
					if ($department_id > 0) {

						$wpdb->delete($this->table_activator->department_table,array(
							'id' => $department_id
						));

						echo json_encode(array(
						'status' => 1,
						'message' => 'Sucess delete the row',
					));
						
					} else {

						echo json_encode(array(
						'status' => 0,
						'message' => 'Sucess delete the row',
					));}
					}
				}

	wp_die();
	}
