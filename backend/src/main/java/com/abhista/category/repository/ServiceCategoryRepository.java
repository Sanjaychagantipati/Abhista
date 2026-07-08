package com.abhista.category.repository;

import com.abhista.category.entity.ServiceCategory;
import com.abhista.category.enums.CategoryType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceCategoryRepository extends JpaRepository<ServiceCategory, Long> {

	Optional<ServiceCategory> findBySlug(String slug);

	List<ServiceCategory> findByCategoryType(CategoryType categoryType);

	List<ServiceCategory> findByParentId(Long parentId);

	List<ServiceCategory> findByParentIdIsNull();
}
