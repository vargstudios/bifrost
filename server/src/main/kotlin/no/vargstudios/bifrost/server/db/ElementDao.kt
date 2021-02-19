package no.vargstudios.bifrost.server.db

import no.vargstudios.bifrost.server.db.model.ElementRow
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate

interface ElementDao {

    @SqlUpdate(
        """
        insert into elements (id, category_id, name, framecount, framerate, channels, alpha, previews, created)
        values (:element.id, :element.categoryId, :element.name, :element.framecount, :element.framerate, :element.channels, :element.alpha, :element.previews, :element.created)
        """
    )
    fun insert(element: ElementRow)

    @SqlQuery("select * from elements")
    fun list(): List<ElementRow>

    @SqlQuery("select * from elements where category_id = :categoryId")
    fun listForCategory(categoryId: String): List<ElementRow>

    @SqlQuery("select * from elements where id = :id")
    fun get(id: String): ElementRow?

    @SqlQuery(
        """
        select *
        from elements element
        where previews = false
          and framecount = (
            select sum(frame.transcoded)
            from element_frames frame
            where frame.element_id = element.id
          )
        """
    )
    fun listReadyForPreviews(): List<ElementRow>

    @SqlUpdate("update elements set previews = true where id = :id")
    fun setPreviewsGenerated(id: String)

    @SqlUpdate("update elements set name = :name where id = :id")
    fun setName(id: String, name: String)

}
