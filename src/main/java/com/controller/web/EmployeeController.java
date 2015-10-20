package com.controller.web;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

import java.util.List;

import javax.validation.Valid;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.domain.Employee;
import com.local.EmplSaveRequest;
import com.service.EmployeeService;

@Controller
public class EmployeeController {
	
	@Autowired
	private EmployeeService emplService;
	
	@RequestMapping(value="/emp/{id}", method=GET, produces = "application/json")
	@ResponseBody
	public Employee getUserById(@PathVariable String id) {
		return emplService.findEmployee(id);
	}
	
	@RequestMapping(value="/dept/{dept}", method=GET, produces = "application/json")
	@ResponseBody
	public List<Employee> getEmployeesByDepartment(@PathVariable String dept) {
		return emplService.findEmployeesByDepartment(dept);
	}
	
	@RequestMapping(value="/emp", method=POST, consumes = "application/json")
	@ResponseBody
	public Employee saveEmployee(@Valid @RequestBody EmplSaveRequest request) {
		return emplService.saveEmployee(request);
	}
	
//	@RequestMapping(value="/emps", method=GET, consumes = "application/json")
//	@ResponseBody
//	public Employee getEmployees() {
//		JSONObject output = new JSONObject(jsonOut);
//	    JSONArray docs = response.getJSONArray("infile");
//
//	     String csv = CDL.toString(docs);
//	}
	
//	@RequestMapping(value="/user", method={PUT,POST} , consumes = "application/json")
//	@ResponseBody
//	public void updateUser(@RequestBody User user) {
//		final User repoUser = userRepository.findOne(user.getId());
//		repoUser.setActive(user.getActive());
//		userRepository.save(repoUser);
//	}
}
